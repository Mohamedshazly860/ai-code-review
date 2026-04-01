import logging
from django.core.cache import cache

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# TTL Constants (seconds)
# ─────────────────────────────────────────────
REVIEW_LIST_TTL = 60 * 5
REVIEW_DETAIL_TTL = 60 * 60 


def _review_list_key(user_id: int) -> str:
    """Cache key for a user's review list."""
    return f'review:list:{user_id}'


def _review_detail_key(review_id: int) -> str:
    """Cache key for a single completed review."""
    return f'review:detail:{review_id}'


# ─────────────────────────────────────────────
# Review List Cache
# ─────────────────────────────────────────────

def get_cached_review_list(user_id: int):
    """
    Returns cached review list for a user, or None on cache miss.
    The caller is responsible for fetching from DB on None.
    """
    key = _review_list_key(user_id)
    cached = cache.get(key)

    if cached is not None:
        logger.debug(f"Cache HIT: review list for user {user_id}")
    else:
        logger.debug(f"Cache MISS: review list for user {user_id}")

    return cached


def set_cached_review_list(user_id: int, data: list) -> None:
    """Stores serialized review list in cache."""
    key = _review_list_key(user_id)
    cache.set(key, data, timeout=REVIEW_LIST_TTL)
    logger.debug(f"Cache SET: review list for user {user_id} (TTL: {REVIEW_LIST_TTL}s)")


def invalidate_review_list(user_id: int) -> None:
    """
    Deletes the cached review list for a user.
    Called when a new review is created so the next
    GET request fetches fresh data from the database.
    """
    key = _review_list_key(user_id)
    cache.delete(key)
    logger.debug(f"Cache INVALIDATED: review list for user {user_id}")


# ─────────────────────────────────────────────
# Review Detail Cache
# ─────────────────────────────────────────────

def get_cached_review_detail(review_id: int):
    """Returns cached review detail, or None on cache miss."""
    key = _review_detail_key(review_id)
    cached = cache.get(key)

    if cached is not None:
        logger.debug(f"Cache HIT: review detail #{review_id}")
    else:
        logger.debug(f"Cache MISS: review detail #{review_id}")

    return cached


def set_cached_review_detail(review_id: int, data: dict) -> None:
    """
    Stores a completed review in cache.
    Only called when status is COMPLETED — we never cache
    pending or processing reviews since they're about to change.
    """
    key = _review_detail_key(review_id)
    cache.set(key, data, timeout=REVIEW_DETAIL_TTL)
    logger.debug(f"Cache SET: review detail #{review_id} (TTL: {REVIEW_DETAIL_TTL}s)")


def invalidate_review_detail(review_id: int) -> None:
    """Deletes cached review detail — called if review is updated."""
    key = _review_detail_key(review_id)
    cache.delete(key)
    logger.debug(f"Cache INVALIDATED: review detail #{review_id}")