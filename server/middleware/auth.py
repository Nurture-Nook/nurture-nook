from fastapi import Request
from starlette.responses import JSONResponse
from ..utils.auth import decode_jwt_token, get_token_from_request
import logging

# Include all public paths that don't require authentication
PUBLIC_PATHS = [
    "/auth/register",
    "/auth/login",
    "/auth/me",
    "/auth/logout",
    "/",
    "/cookie-debug",
    "/auth-test",
    "/cors-test",
    "/cookie-test",
    "/docs",
    "/openapi.json",
    "/redoc"
  
PUBLIC_PATHS = [
    "/",
    "/auth/register",
    "/auth/login",
    "/auth/test"
]

async def auth_middleware(request: Request, call_next):
    """
    Middleware for authentication.
    Checks if the request has a valid auth token.
    """
    # Allow OPTIONS requests to pass through without authentication for CORS preflight
    if request.method == "OPTIONS":
        response = await call_next(request)
        return response
    
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
        )
    
    return await call_next(request)
        elif request.cookies.get("auth_token"):
            token = request.cookies.get("auth_token")
            token_source = "auth_token cookie"
            print(f"Auth middleware - Found token in auth_token cookie: {token[:10]}...")
        elif request.query_params.get("token"):  # Last resort: query param
            token = request.query_params.get("token")
            token_source = "query parameter"
            print(f"Auth middleware - Found token in query parameter: {token[:10]}...")

        if not token:
            print("Auth middleware - No token found in any source")
            return JSONResponse({"detail": "Missing authentication token. Please log in again."}, status_code=401)

        try:
            print(f"Auth middleware - Decoding token: {token[:10]}...")
            payload = decode_jwt_token(token)
            print(f"Auth middleware - Token decoded successfully: {payload}")
        except Exception as e:
            print(f"Auth middleware - Token decode error: {str(e)}")
            return JSONResponse({"detail": f"Invalid token: {str(e)}"}, status_code=401)

        user_id = payload.get("user_id")
        if not user_id:
            print(f"Auth middleware - Invalid payload, missing user_id: {payload}")
            return JSONResponse({"detail": "Invalid token payload"}, status_code=401)

        print(f"Auth middleware - Looking up user with ID: {user_id}")
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            print(f"Auth middleware - User with ID {user_id} not found in database")
            return JSONResponse({"detail": "User not found"}, status_code=404)
        
        print(f"Auth middleware - User found: {db_user.username} (ID: {db_user.id})")

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse({"detail": "Missing authentication token"}, status_code=401)

    token = auth_header.split(" ")[1]

    try:
        payload = decode_jwt_token(token)
        request.state.user = payload
    except Exception as e:
        return JSONResponse({"detail": str(e)}, status_code=401)

    return await call_next(request)
