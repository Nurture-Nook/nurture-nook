from fastapi import FastAPI, Request
from starlette.responses import Response
import datetime
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .middleware.auth import auth_middleware
from .middleware.logger_middleware import log_requests
from .middleware.rate_limit import rate_limit_middleware
from .middleware.cors import setup_cors
from .routes import auth, category, chat, comment, message, post, user, warning
from .db import Base, engine
import os

from routes import auth, users  # Import your existing routes
from routes.debug import router as debug_router  # Import the debug router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nurture Nook API",
    description="Backend API for Nurture Nook",
    version="1.0.0"
)

# Always add CORS middleware first before any other middlewares
setup_cors(app)

# Add other middleware AFTER CORS middleware
app.middleware("http")(auth_middleware)
app.middleware("http")(log_requests)
app.middleware("http")(rate_limit_middleware)

# Register your routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(debug_router)  # Add the debug router

# Add a root endpoint for testing
@app.get("/")
def read_root():
    return {"message": "Welcome to Nurture Nook API", "status": "online"}

import server.schemas.model_rebuild

app.include_router(auth.router)
app.include_router(category.router)
app.include_router(chat.router)
app.include_router(comment.router)
app.include_router(message.router)
app.include_router(post.router)
app.include_router(user.router)

@app.get("/auth-test")
def auth_test(request: Request):
    """Debug endpoint to check what the server receives in the request."""
    try:
        cookies = dict(request.cookies)
        headers = dict(request.headers)
        # Don't log full headers or cookies in prod as they contain sensitive data
        return {
            "message": "Auth test endpoint",
            "has_access_token_cookie": "access_token" in cookies,
            "has_auth_token_cookie": "auth_token" in cookies,
            "has_authorization_header": "authorization" in {k.lower(): v for k, v in headers.items()},
            "cookies_keys": list(cookies.keys()),
            "headers_keys": list(headers.keys()),
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/get-user-by-username")
def get_user_by_username(username: str, request: Request):
    """Debug endpoint to directly get a user by username."""
    try:
        from .db import SessionLocal
        from .models import User
        from .schemas.users import UserPrivateOut
        
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.username == username).first()
            if user:
                user_dict = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "created_at": user.created_at.isoformat() if hasattr(user, 'created_at') else None
                }
                
                # Generate token
                from .utils.auth import generate_jwt_token
                token = generate_jwt_token(user.id)
                
                return {
                    "message": f"Found user: {username}",
                    "user": user_dict,
                    "token": token
                }
            else:
                return {"error": f"User {username} not found"}
        finally:
            db.close()
    except Exception as e:
        return {"error": str(e)}

@app.options("/{rest_of_path:path}")
async def options_handler(rest_of_path: str, request: Request):
    """
    Handle preflight OPTIONS requests for all routes.
    This ensures CORS preflight requests get proper headers even if they don't match exact routes.
    """
    print(f"OPTIONS request received for path: /{rest_of_path}")
    
    # Determine the appropriate origin based on the request's origin header
    origin = request.headers.get("origin", "http://localhost:3000")
    env = os.environ.get("APP_ENV", "development")
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    allowed_origins = ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", frontend_url]
    
    if env == "production":
        prod_domain = os.environ.get("PRODUCTION_DOMAIN")
        if prod_domain:
            allowed_origins.append(f"https://{prod_domain}")
    
    # Return a response with appropriate CORS headers
    headers = {
        "Access-Control-Allow-Origin": origin if origin in allowed_origins else allowed_origins[0],
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, Origin, X-Requested-With, Cache-Control, X-CSRF-Token",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",  # Cache preflight response for 24 hours
    }
    
    return Response(status_code=200, headers=headers)

@app.get("/cors-test")
async def cors_test():
    """Debug endpoint to test CORS configuration."""
    return {"message": "CORS test successful", "time": datetime.datetime.now().isoformat()}

@app.get("/cookie-debug")
def cookie_debug(request: Request):
    """Debug endpoint to examine cookies being received by the server."""
    cookies = dict(request.cookies)
    headers = {k: v for k, v in request.headers.items() if k.lower() != "cookie"}
    
    # Create a test cookie in the response
    response = Response(content="Cookie debug endpoint")
    env = os.environ.get("APP_ENV", "development") 
    is_prod = env == "production"
    
    response.set_cookie(
        key="debug_cookie",
        value="server_set_this_cookie",
        httponly=False,
        secure=is_prod,
        samesite="None" if not is_prod else "Lax",
        max_age=300,  # 5 minutes
        path="/"
    )
    
    response.headers["Content-Type"] = "application/json"
    response.body = str({
        "cookies_received": cookies,
        "headers": headers,
        "note": "A debug_cookie has been set in this response"
    }).encode()
    
    return response

@app.get("/cors-debug")
async def cors_debug(request: Request):
    """Debug endpoint to test CORS configuration and authentication."""
    # Get cookies, headers, and authentication information
    cookies = dict(request.cookies)
    headers = {k: v for k, v in request.headers.items()}
    auth_info = None
    
    # Try to get token and auth info
    token = request.cookies.get("access_token")
    if not token and "authorization" in {k.lower(): v for k, v in headers.items()}:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if token:
        try:
            from .utils.auth import decode_jwt_token
            auth_info = decode_jwt_token(token)
        except Exception as e:
            auth_info = {"error": str(e)}
    
    # Create a response with test cookies
    response = JSONResponse({
        "message": "CORS debug successful",
        "time": datetime.datetime.now().isoformat(),
        "request_origin": request.headers.get("origin", "No origin header"),
        "request_method": request.method,
        "has_access_token": "access_token" in cookies,
        "auth_header_present": "authorization" in {k.lower(): v for k, v in headers.items()},
        "auth_info": auth_info,
        "cookies_keys": list(cookies.keys()),
    })
    
    # Add a test cookie
    response.set_cookie(
        key="cors_debug_cookie",
        value="test_value",
        httponly=False,
        secure=False,
        samesite="None",
        max_age=60,  # 1 minute
    )
    
    return response

app.include_router(warning.router)
