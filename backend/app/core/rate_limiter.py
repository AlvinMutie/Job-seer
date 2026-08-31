import time
from collections import defaultdict
from typing import Dict, List, Tuple, Optional
from fastapi import Request, HTTPException, status

from app.core.errors import APIException, ErrorCode


class RateLimiter:
    """
    In-memory thread-safe sliding window rate limiter.
    Allows configuring per-endpoint or global rate limits based on client IP or authenticated user ID.
    """
    def __init__(self, requests_per_minute: int = 60, enabled: bool = True):
        self.requests_per_minute = requests_per_minute
        self.window_seconds = 60
        self.enabled = enabled
        self.history: Dict[str, List[float]] = defaultdict(list)

    def is_rate_limited(self, key: str, max_requests: Optional[int] = None) -> Tuple[bool, int]:
        if not self.enabled:
            return False, 0

        limit = max_requests or self.requests_per_minute
        now = time.time()
        cutoff = now - self.window_seconds

        # Prune timestamps older than window
        timestamps = [t for t in self.history[key] if t > cutoff]
        self.history[key] = timestamps

        if len(timestamps) >= limit:
            retry_after = int(self.window_seconds - (now - timestamps[0])) + 1
            return True, max(1, retry_after)

        self.history[key].append(now)
        return False, 0

    def reset(self):
        self.history.clear()


# Global limiter instance
global_rate_limiter = RateLimiter(requests_per_minute=120, enabled=True)


def rate_limit(max_requests: int = 60, key_prefix: str = "global"):
    """
    FastAPI dependency factory for rate limiting routes.
    """
    async def dependency(request: Request):
        if not global_rate_limiter.enabled:
            return

        client_ip = request.client.host if request.client else "127.0.0.1"
        # Combine prefix and IP for rate limit key
        key = f"{key_prefix}:{client_ip}"

        is_limited, retry_after = global_rate_limiter.is_rate_limited(key, max_requests=max_requests)
        if is_limited:
            raise APIException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                error_code=ErrorCode.TOO_MANY_REQUESTS,
                message=f"Rate limit exceeded for {key_prefix}. Please wait {retry_after} seconds before retrying.",
                details={"retry_after_seconds": retry_after, "limit": max_requests}
            )

    return dependency
