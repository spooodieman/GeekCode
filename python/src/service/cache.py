"""In-memory cache and rate limiter for external crawler requests."""
import time
from functools import wraps
from threading import Lock
from typing import Any, Callable

_cache: dict[str, tuple[float, Any]] = {}
_lock = Lock()
_call_times: list[float] = []
MAX_CALLS_PER_MINUTE = 30


def cached(ttl: int = 300):
    """Cache decorator with TTL (seconds)."""
    def decorator(fn: Callable):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            key = str(args) + str(kwargs)
            with _lock:
                if key in _cache:
                    ts, val = _cache[key]
                    if time.time() - ts < ttl:
                        return val
            result = fn(*args, **kwargs)
            with _lock:
                _cache[key] = (time.time(), result)
            return result
        return wrapper
    return decorator


def rate_limited(fn: Callable):
    """Limit to MAX_CALLS_PER_MINUTE per minute."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        now = time.time()
        with _lock:
            _call_times[:] = [t for t in _call_times if now - t < 60]
            if len(_call_times) >= MAX_CALLS_PER_MINUTE:
                raise RuntimeError('Rate limit exceeded â€“ please wait before retrying.')
            _call_times.append(now)
        return fn(*args, **kwargs)
    return wrapper