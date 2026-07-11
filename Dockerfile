# =============================================================================
# MWMBL Dockerfile - Optimized for Railway
# =============================================================================

# Stage 1: Build Frontend
FROM node:20-bullseye AS frontend

WORKDIR /front-end

# Copy and install dependencies
COPY front-end/package*.json ./
RUN npm ci && npm run build

# Stage 2: Build Python Backend
FROM python:3.11-slim-bookworm AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONFAULTHANDLER=1 \
    PYTHONHASHSEED=random \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    pkg-config \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/ \
    && apt-get clean

# Copy requirements first for better caching
COPY pyproject.toml uv.lock ./

# Install uv for fast dependency management
RUN pip install uv

# Create virtual environment
RUN uv venv /venv
ENV PATH="/venv/bin:$PATH"

# Install Rust for maturin (needed for mwmbl_rank)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --profile minimal
ENV PATH="/root/.cargo/bin:$PATH"

# Install clang for bindgen (needed by some Python packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    clang \
    libclang-dev \
    patchelf \
    && rm -rf /var/lib/apt/lists/ \
    && apt-get clean

# Install Python dependencies
RUN uv pip install --python /venv/bin/python maturin

# Copy application source
COPY mwmbl/ ./mwmbl/
COPY mwmbl_rank/ ./mwmbl_rank/
COPY manage.py ./

# Build and install the package with Rust extensions
RUN uv pip install --python /venv/bin/python --no-build-isolation -e .

# Copy Rust cargo for runtime
RUN mkdir -p /root/.cargo && cp -a /root/.cargo /root/.cargo_copy

# =============================================================================
# Runtime stage
# =============================================================================
FROM python:3.11-slim-bookworm AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONFAULTHANDLER=1 \
    PYTHONHASHSEED=random \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install only runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/ \
    && apt-get clean

# Create non-root user
RUN groupadd --gid 1000 mwmbl && \
    useradd --uid 1000 --gid mwmbl --shell /bin/bash --create-home mwmbl

# Copy virtual environment from builder
COPY --from=builder /venv /venv
ENV PATH="/venv/bin:$PATH"

# Copy frontend build
COPY --from=frontend /front-end/dist /app/static

# Copy application files
COPY --from=builder /app/manage.py /app/
COPY --from=builder /app/mwmbl /app/mwmbl/

# Copy Rust libraries (needed by mwmbl_rank .so files)
COPY --from=builder /root/.cargo_copy /root/.cargo
ENV PATH="/root/.cargo/bin:$PATH"

# Create necessary directories
RUN mkdir -p /app/storage /app/static_files && \
    chown -R mwmbl:mwmbl /app

# Switch to non-root user
USER mwmbl

# Expose port (Railway will set PORT env var)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5000/health/ || exit 1

# Default command - Railway will override PORT
CMD ["sh", "-c", "python manage.py migrate && gunicorn mwmbl.asgi:application --bind 0.0.0.0:$$PORT --workers 2 --timeout 120"]
