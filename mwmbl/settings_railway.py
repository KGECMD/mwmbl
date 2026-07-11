"""
Railway Production Settings for MWMBL.

This settings module is optimized for Railway deployment with:
- Railway-compatible database and Redis configuration
- Health check endpoints
- Graceful shutdown support
- Security hardening
- Performance optimizations
"""
import os
import logging
from pathlib import Path

from mwmbl.settings_common import *

# =============================================================================
# Core Security Settings
# =============================================================================

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", os.environ.get("SECRET_KEY", "change-me-in-production"))

DEBUG = os.environ.get("DEBUG", "false").lower() in ("true", "1", "yes")

# Railway provides $RAILWAY_PUBLIC_DOMAIN
RAILWAY_PUBLIC_DOMAIN = os.environ.get("RAILWAY_PUBLIC_DOMAIN", "")
# Clean the domain (remove https:// if present)
if RAILWAY_PUBLIC_DOMAIN.startswith("https://"):
    RAILWAY_PUBLIC_DOMAIN = RAILWAY_PUBLIC_DOMAIN.replace("https://", "")
elif RAILWAY_PUBLIC_DOMAIN.startswith("http://"):
    RAILWAY_PUBLIC_DOMAIN = RAILWAY_PUBLIC_DOMAIN.replace("http://", "")

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
if RAILWAY_PUBLIC_DOMAIN:
    ALLOWED_HOSTS.append(RAILWAY_PUBLIC_DOMAIN)

# Add custom domains if provided
if custom_domains := os.environ.get("ALLOWED_HOSTS", ""):
    ALLOWED_HOSTS.extend([h.strip() for h in custom_domains.split(",") if h.strip()])

CSRF_TRUSTED_ORIGINS = [
    f"https://{domain}"
    for domain in ALLOWED_HOSTS
    if domain not in ("localhost", "127.0.0.1")
]
CSRF_TRUSTED_ORIGINS.extend([
    "http://localhost",
    "http://127.0.0.1",
])

# =============================================================================
# Sites Framework
# =============================================================================

# Site domain for email confirmation links
SITE_NAME = os.environ.get("SITE_NAME", "mwmbl.org")
SITE_DOMAIN = os.environ.get("SITE_DOMAIN", f"https://{RAILWAY_PUBLIC_DOMAIN}" if RAILWAY_PUBLIC_DOMAIN else "https://mwmbl.org")

# Allauth confirmation URL - this is the key setting!
# Set this to your frontend domain where users will confirm their email
ACCOUNT_CONFIRMATION_URL = os.environ.get(
    "ACCOUNT_CONFIRMATION_URL",
    f"{SITE_DOMAIN}/confirm-email"
)

# Ensure email confirmation links use HTTPS
SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "true").lower() in ("true", "1", "yes")

# =============================================================================
# Static Files
# =============================================================================

STATIC_ROOT = "/app/static"
STATIC_URL = "/static/"
STATICFILES_DIRS = []

# Django Vite for frontend assets
DJANGO_VITE_ASSETS_PATH = "/app/static"
DJANGO_VITE_MANIFEST_PATH = Path(DJANGO_VITE_ASSETS_PATH) / "manifest.json"
STATICFILES_DIRS.append(DJANGO_VITE_ASSETS_PATH)

# Additional static files location
STATICFILES_DIRS.append(str(Path(__file__).parent.parent / "front-end" / "assets"))


# =============================================================================
# Data Paths
# =============================================================================

DATA_PATH = os.environ.get("DATA_PATH", "/app/storage")
Path(DATA_PATH).mkdir(parents=True, exist_ok=True)

INDEX_NAME = os.environ.get("INDEX_NAME", 'index-v2.tinysearch')

# Bloom filter paths
NUM_URLS_IN_BLOOM_FILTER = int(os.environ.get("NUM_URLS_IN_BLOOM_FILTER", 100_000_000))
URLS_BLOOM_FILTER_PATH = str(Path(DATA_PATH) / "urls-{year}-{month}.bloom")
URLS_BLOOM_FILTER_FALLBACK_PATH = str(Path(DATA_PATH) / "urls.bloom")

NUM_DOMAINS_IN_BLOOM_FILTER = int(os.environ.get("NUM_DOMAINS_IN_BLOOM_FILTER", 100_000_000))
DOMAIN_LINKS_BLOOM_FILTER_PATH = str(Path(DATA_PATH) / "links_{domain_group}.bloom")

REQUEST_CACHE_PATH = f"{DATA_PATH}/request_cache"
Path(REQUEST_CACHE_PATH).mkdir(parents=True, exist_ok=True)

BATCH_DIR_NAME = os.environ.get("BATCH_DIR", "batches")


# =============================================================================
# Database Configuration (Railway PostgreSQL)
# =============================================================================

# Railway provides DATABASE_URL
# dj-database-url parses it automatically
import dj_database_url

DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600)
    }
else:
    # Fallback for local development
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# =============================================================================
# Redis Configuration (Railway Redis)
# =============================================================================

REDIS_URL = os.environ.get("REDIS_URL", os.environ.get("REDISTOGO_URL", "redis://localhost:6379"))

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "SOCKET_CONNECT_TIMEOUT": 5,
            "SOCKET_TIMEOUT": 5,
            "CONNECTION_POOL_KWARGS": {
                "max_connections": 50,
                "retry_on_timeout": True,
            },
        },
        "TIMEOUT": None,
    }
}


# =============================================================================
# Email Configuration
# =============================================================================

# Railway can provide email credentials or use SendGrid
EMAIL_BACKEND = os.environ.get("EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.sendgrid.net")
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "apikey")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "true").lower() in ("true", "1", "yes")
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "MWMBL <noreply@mwmbl.org>")

# Domain for email links (must match ACCOUNT_CONFIRMATION_URL domain)
EMAIL_USE_LOCALIZED_FOOTER = True


# =============================================================================
# Security Settings
# =============================================================================

# HTTPS/SSL
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Session Security
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"

# CSRF Security
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = "Lax"

# HSTS (HTTP Strict Transport Security)
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Content Security Policy
CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'", "'unsafe-inline'", "https:" if not DEBUG else "*")
CSP_STYLE_SRC = ("'self'", "'unsafe-inline'", "https://fonts.googleapis.com")
CSP_FONT_SRC = ("'self'", "https://fonts.gstatic.com")
CSP_IMG_SRC = ("'self'", "data:", "https:", "blob:")
CSP_CONNECT_SRC = ("'self'",)
CSP_FRAME_ANCESTORS = ("'none'",)
CSP_BASE_URI = ("'self'",)

# X-Content-Type-Options
SECURE_CONTENT_TYPE_NOSNIFF = True

# X-Frame-Options
X_FRAME_OPTIONS = "DENY"

# Referrer Policy
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"


# =============================================================================
# Logging Configuration
# =============================================================================

logger = logging.getLogger(__name__)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {asctime} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": os.environ.get("LOG_LEVEL", "INFO"),
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.security": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        "mwmbl": {
            "handlers": ["console"],
            "level": os.environ.get("LOG_LEVEL", "DEBUG"),
            "propagate": False,
        },
    },
}


# =============================================================================
# Gunicorn Configuration
# =============================================================================

GUNICORN_WORKERS = int(os.environ.get("GUNICORN_WORKERS", "2"))
GUNICORN_THREADS = int(os.environ.get("GUNICORN_THREADS", "4"))
GUNICORN_TIMEOUT = int(os.environ.get("GUNICORN_TIMEOUT", "120"))
GUNICORN_KEEPALIVE = int(os.environ.get("GUNICORN_KEEPALIVE", "5"))
GUNICORN_GRACEFUL_TIMEOUT = int(os.environ.get("GUNICORN_GRACEFUL_TIMEOUT", "30"))


# =============================================================================
# Performance Settings
# =============================================================================

CONN_MAX_AGE = 600  # 10 minutes
COMPRESS_ENABLED = True
CACHE_MIDDLEWARE_SECONDS = 300
DB_QUERY_TIMEOUT = 30


# =============================================================================
# Third-party Services
# =============================================================================

# Sentry
SENTRY_DSN = os.environ.get("SENTRY_DSN")
if SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    from sentry_sdk.integrations.logging import LoggingIntegration

    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[
            DjangoIntegration(),
            LoggingIntegration(level=logging.INFO, event_level=logging.WARNING),
        ],
        traces_sample_rate=float(os.environ.get("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
        send_default_pii=False,
    )

# Polar (for billing)
POLAR_ACCESS_TOKEN = os.environ.get("POLAR_ACCESS_TOKEN", "")
POLAR_WEBHOOK_SECRET = os.environ.get("POLAR_WEBHOOK_SECRET", "")
POLAR_PRODUCT_ID_STARTER = os.environ.get("POLAR_PRODUCT_ID_STARTER", "")
POLAR_PRODUCT_ID_PRO = os.environ.get("POLAR_PRODUCT_ID_PRO", "")
POLAR_SERVER = os.environ.get("POLAR_SERVER", "production")


# =============================================================================
# Application-Specific Settings
# =============================================================================

MWMBL_APPLICATION_KEY = os.environ.get("MWMBL_APPLICATION_KEY", "")
KEY_ID = os.environ.get("MWMBL_KEY_ID", "")
ENDPOINT_URL = os.environ.get("MWMBL_ENDPOINT_URL", "https://s3.amazonaws.com")
BUCKET_NAME = os.environ.get("MWMBL_BUCKET_NAME", "mwmbl-crawl")

NUM_TITLE_CHARS = int(os.environ.get("NUM_TITLE_CHARS", "65"))
NUM_EXTRACT_CHARS = int(os.environ.get("NUM_EXTRACT_CHARS", "155"))

RUST_MODEL_PATH = Path(__file__).parent / 'resources' / "model.xgb"


# =============================================================================
# Admin Configuration
# =============================================================================

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@mwmbl.org")
MAINTENANCE_MODE = os.environ.get("MAINTENANCE_MODE", "false").lower() in ("true", "1", "yes")


# =============================================================================
# Allauth Settings (overrides from common)
# =============================================================================

# Key setting: Use the frontend domain for confirmation links
ACCOUNT_EMAIL_SUBJECT_PREFIX = "[MWMBL] "
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_SESSION_REMEMBER = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_MAX_EMAIL_ADDRESSES = 1
LOGIN_URL = "/accounts/login/"

# Log the confirmation URL for debugging
logger.info(f"Email confirmation URL: {ACCOUNT_CONFIRMATION_URL}")
