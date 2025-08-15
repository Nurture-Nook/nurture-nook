from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse

router = APIRouter(tags=["Debug"])

@router.get("/cookie-test")
async def cookie_test(request: Request):
    """Test endpoint to verify cookie handling"""
    cookies = request.cookies
    headers = {k: v for k, v in request.headers.items()}
    
    response = JSONResponse({
        "cookies": cookies,
        "headers": headers,
        "message": "Cookie test endpoint"
    })
    
    # Set a test cookie
    response.set_cookie(
        key="test_cookie",
        value="cookie_value",
        httponly=True,
        secure=False,  # False for local development
        samesite="lax",  # Try Lax instead of None
        max_age=3600,
    )
    
    return response

@router.get("/cors-test")
async def cors_test():
    """Test endpoint to verify CORS configuration"""
    return {"message": "CORS test successful"}

@router.options("/auth-test")
@router.get("/auth-test")
async def auth_test(request: Request):
    """Test endpoint to verify authentication and preflight requests"""
    auth_header = request.headers.get("Authorization", "No auth header")
    cookie_token = request.cookies.get("access_token", "No cookie token")
    
    return {
        "method": request.method,
        "auth_header": auth_header,
        "cookie_token": cookie_token,
        "all_cookies": request.cookies,
        "origin": request.headers.get("Origin", "No origin"),
        "all_headers": {k: v for k, v in request.headers.items()}
    }
