from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from starlette.responses import JSONResponse
from ..utils.auth import decode_jwt_token
import logging
import os

PUBLIC_PATHS = [
    "/auth/register",
    "/auth/login",
    "/auth/me",
    "/auth/logout",
    "/cookie-debug",
    "/auth-test",
    "/cors-test",
    "/cookie-test"
    "/auth/test"
]

def setup_cors(app):
    print("Setting up CORS middleware")
    # Use environment variable for allowed origins if available, otherwise use defaults
    env = os.environ.get("APP_ENV", "development")
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    
    # For development, we'll try without the regex pattern and with explicit origins
    allowed_origins = [
        "http://localhost:3000", 
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        frontend_url
    ]
    
    if env == "production":
        # Add production domains here when deploying
        prod_domain = os.environ.get("PRODUCTION_DOMAIN")
        if prod_domain:
            allowed_origins.append(f"https://{prod_domain}")
    
    # Remove duplicates while preserving order
    allowed_origins = list(dict.fromkeys(filter(None, allowed_origins)))
    
    print(f"Configuring CORS with origins: {allowed_origins}")
    
    # Configure CORS with explicit origins and no regex - sometimes regex causes issues
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,  # This is crucial for cookies
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["Authorization", "Content-Type", "Accept", "Origin", 
                      "X-Requested-With", "Cache-Control"],
        expose_headers=["Content-Type", "Authorization", "Set-Cookie"],
        max_age=86400,  # Cache preflight requests for 24 hours
    )
    
    # Add a debugging middleware to log all requests
    @app.middleware("http")
    async def debug_middleware(request: Request, call_next):
        print(f"Request: {request.method} {request.url.path}")
        print(f"Origin: {request.headers.get('Origin')}")
        print(f"Headers: {request.headers}")
        print(f"Cookies: {request.cookies}")
        
        response = await call_next(request)
        
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {response.headers}")
        
        return response
    
    print("CORS middleware configured with allow_origins:", allowed_origins)

# WARNING: This auth_middleware function is not being used by the application.
# The actual auth_middleware is in the middleware/auth.py file.
# This function is kept here for reference but is not active.
async def auth_middleware_unused(request: Request, call_next):
    logging.info(f"Request path: {request.url.path}, method: {request.method}")
    logging.info(f"Cookies: {request.cookies}")
    if request.url.path in PUBLIC_PATHS or request.method == "OPTIONS":
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    cookie_token = request.cookies.get("access_token")
    if not auth_header and not cookie_token:
        return JSONResponse({"detail": "Missing authentication token"}, status_code=401)

    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    elif cookie_token:
        token = cookie_token

    try:
        payload = decode_jwt_token(token)
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=401)

    request.state.user = payload

    return await call_next(request)
