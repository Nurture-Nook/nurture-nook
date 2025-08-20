from fastapi import Request
from starlette.responses import JSONResponse
from ..utils.auth import decode_jwt_token, get_token_from_request
import logging

# List of public paths that don't require authentication
PUBLIC_PATHS = [
    "/",
    "/auth/register",
    "/auth/login",
    "/auth/test",
    "/cookie-debug",
    "/auth-test",
    "/cors-test",
    "/cookie-test",
    "/docs",
    "/openapi.json",
    "/redoc"
]

async def auth_middleware(request: Request, call_next):
    """
    Middleware for authentication.
    Checks if the request has a valid auth token.
    """
    # Allow OPTIONS requests to pass through without authentication for CORS preflight
    if request.method == "OPTIONS":
        return await call_next(request)

    # Skip auth check for public paths
    path = request.url.path
    if any(path.startswith(public_path) for public_path in PUBLIC_PATHS):
        return await call_next(request)

    # Try to get token from cookie or authorization header
    token = get_token_from_request(request)

    if not token:
        return JSONResponse(
            status_code=401,
            content={"detail": "Not authenticated"}
        )

    try:
        # Validate the token
        payload = decode_jwt_token(token)
        request.state.user = payload
    except Exception as e:
        return JSONResponse(
            status_code=401,
            content={"detail": f"Invalid authentication token: {str(e)}"}
        )

    return await call_next(request)
