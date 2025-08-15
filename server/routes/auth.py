from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from schemas.users import UserCreate, UserLogin
from crud.user import create_user, get_user_by_email, get_user_by_username, get_user_by_id
from services.auth import authenticate_user
from utils.auth import generate_jwt_token, decode_jwt_token, get_token_from_request
from fastapi.responses import JSONResponse
from db import get_db
from datetime import datetime, timedelta
import os

router = APIRouter(prefix="/auth", tags=["Auth"])


def set_auth_cookie(response: JSONResponse, token: str):
    """
    Centralized cookie settings so register/login behave the same.
    Cookie is secure in production, insecure allowed only in development.
    SameSite policy is set based on environment to ensure proper security.
    """
    # Get environment - default to production for safety
    env = os.environ.get("APP_ENV", "development")
    is_prod = env == "production"

    # Calculate expiration time for better browser handling
    expires = datetime.utcnow() + timedelta(hours=1)

    # For development, use more permissive settings
    if not is_prod:
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,  # Not secure in development
            samesite="lax",  # Try lax instead of None for development
            max_age=3600,
            expires=expires,
            path="/",
        )
    else:
        # Secure settings for production
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=3600,
            expires=expires,
            path="/",
        )
    
    # Also send token in response body for clients that can't use cookies
    response.headers["Authorization"] = f"Bearer {token}"


@router.post("/register")
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user_create.email):
        raise HTTPException(status_code=400, detail="Email Already Registered")

    if get_user_by_username(db, user_create.username):
        raise HTTPException(status_code=400, detail="Username Not Available")

    user = create_user(db, user_create)
    access_token = generate_jwt_token(user.id)

    response = JSONResponse({"message": "Registration successful", "user_id": user.id, "username": user.username})
    set_auth_cookie(response, access_token)

    return response


@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    access_token = generate_jwt_token(user.id)

    response = JSONResponse({"message": "Login successful", "user_id": user.id, "username": user.username})
    set_auth_cookie(response, access_token)

    return response


@router.post("/logout")
def logout():
    """Clear the authentication cookie when user logs out."""
    response = JSONResponse({"message": "Logout successful"})
    env = os.environ.get("APP_ENV", "development")
    is_prod = env == "production"
    
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        secure=is_prod,
        samesite="Lax" if is_prod else "None",
    )
    
    if not is_prod:
        response.delete_cookie(
            key="debug_token_presence",
            path="/",
            httponly=False,
            secure=False,
            samesite="None",
        )
    
    return response


@router.get("/cookie-test")
def cookie_test():
    """Test endpoint to verify cookies can be set and sent."""
    response = JSONResponse({"message": "Cookie test endpoint"})
    response.set_cookie(
        key="test_cookie",
        value="cookie_test_value",
        httponly=False,  # Set to False so it's visible in JavaScript
        secure=False,    # Set to False for testing on localhost
        samesite="None", # Required for cross-site (if testing from different port)
        max_age=60,      # Short-lived for testing
        path="/",
    )
    return response


@router.get("/me")
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Get the current authenticated user"""
    print(f"Auth/me endpoint called")
    print(f"Cookies received: {request.cookies}")
    print(f"Headers received: {dict(request.headers)}")
    
    # Try to get token from cookie first
    token = request.cookies.get("access_token")
    
    # If no token in cookie, try Authorization header
    if not token and "authorization" in request.headers:
        auth = request.headers.get("authorization")
        if auth and auth.startswith("Bearer "):
            token = auth.split(" ")[1]
    
    print(f"Token found: {token is not None}")
    
    if not token:
        return JSONResponse(
            status_code=401,
            content={"detail": "Not authenticated - no token found"}
        )
    
    try:
        from utils.auth import decode_jwt_token
        # Decode the token and get user_id
        payload = decode_jwt_token(token)
        user_id = payload.get("user_id")
        
        if not user_id:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid token format"}
            )
        
        # Get user from database
        from crud.user import get_user_by_id
        user = get_user_by_id(db, user_id)
        
        if not user:
            return JSONResponse(
                status_code=404,
                content={"detail": "User not found"}
            )
        
        # Return user data (excluding sensitive information)
        response = JSONResponse({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            # Add other non-sensitive fields as needed
        })
        
        # Refresh the auth cookie with each successful authentication
        set_auth_cookie(response, token)
        
        return response
    except Exception as e:
        print(f"Error in /auth/me: {str(e)}")
        return JSONResponse(
            status_code=401,
            content={"detail": f"Authentication error: {str(e)}"}
        )
