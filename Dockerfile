# =============================================================================
# MWMBL Dockerfile - Optimized for Railway Deployment
# =============================================================================

# Stage 1: Build Frontend
FROM node:20-bookworm-slim AS frontend

WORKDIR /front-end
COPY front-end/package*.json ./
RUN npm ci
COPY front-end/ ./
RUN npm run build

# Stage 2: Build Python Backend with Rust extension
FROM python:3.11.12-slim-bookworm AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
 PYTHONFAULTHANDLER=1 \
 PYTHONHASHSEED=random \
 PYTHONUNBUFFERED=1

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
 build-essential curl clang libclang-dev libpq-dev pkg-config git && \
 rm -rf /var/lib/apt/lists/*

# Install Rust toolchain
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
ENV PATH="/root/.cargo/bin:${PATH}"

# Create virtual environment
RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Copy dependency files first for better caching
COPY pyproject.toml uv.lock ./

# Install dependencies without Rust extensions first
RUN pip install maturin

# Copy application source
COPY mwmbl/ ./mwmbl/
COPY mwmbl_rank/ ./mwmbl_rank/
COPY manage.py ./

# Build and install the package with Rust extensions
RUN pip install --no-build-isolation -e .

# Stage 3: Runtime Image
FROM python:3.11.12-slim-bookworm-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
 PYTHONFAULTHANDLER=1 \
 PYTHONHASHSEED=random \
 PYTHONUNBUFFERED=1 \
 PYTHONTRACEMALLOC=1

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
 libpq5 curl && \
 rm -rf /var/lib/apt/lists/*

# Create non-root user for security
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

# Create necessary directories
RUN mkdir -p /app/storage /app/static_files && \
 chown -R mwmbl:mwmbl /app

# Switch to non-root user
USER mwmbl

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
 CMD curl -f http://localhost:5000/health/ || exit 1

# Expose port
EXPOSE 5000

# Default command - can be overridden by Railway
CMD ["sh", "-c", "python manage.py migrate && gunicorn mwmbl.asgi:application --bind 0.0.0.0:5000 --workers 2 --timeout 120 --access-logfile - --error-logfile -"]
