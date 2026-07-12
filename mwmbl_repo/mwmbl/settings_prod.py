import os

from mwmbl.settings_common import *


SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]


STATIC_ROOT = "/app/static/"

DJANGO_VITE_ASSETS_PATH = "/front-end-build/"
DJANGO_VITE_MANIFEST_PATH = Path(DJANGO_VITE_ASSETS_PATH) / "manifest.json"
STATICFILES_DIRS = [DJANGO_VITE_ASSETS_PATH]

DEBUG = False
ALLOWED_HOSTS = ["api.mwmbl.org", "mwmbl.org", "beta.mwmbl.org"]
CSRF_TRUSTED_ORIGINS = [f"https://{domain}" for domain in ALLOWED_HOSTS]


# === Production-only hardening ==============================================
# We are behind Dokku's nginx, which terminates TLS and forwards
# `X-Forwarded-Proto: https`. Trust that header so request.is_secure() works.

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 365  # one year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True


# Sendgrid email settings
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_PORT = 587
EMAIL_USE_TLS = True


DATA_PATH = "/app/storage"
INDEX_NAME = 'index-v2-400G.tinysearch'

# 400GB index
NUM_PAGES = 102400000

URLS_BLOOM_FILTER_PATH = str(Path(DATA_PATH) / "urls-{year}-{month}.bloom")
URLS_BLOOM_FILTER_FALLBACK_PATH = str(Path(DATA_PATH) / "urls.bloom")
NUM_URLS_IN_BLOOM_FILTER = 200_000_000

DOMAIN_LINKS_BLOOM_FILTER_PATH = str(Path(DATA_PATH) / "links_{domain_group}.bloom")
NUM_DOMAINS_IN_BLOOM_FILTER = 100_000_000

REQUEST_CACHE_PATH = f"{DATA_PATH}/request_cache"
