from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..utils.auth import decode_jwt_token
from ..models import User

PUBLIC_PATHS = {"/", "/auth/login", "/auth/register"}

async def auth_middleware(request: Request, call_next):
    if request.url.path in PUBLIC_PATHS or request.method == "OPTIONS":
        return await call_next(request)

    db: Session = SessionLocal()
    try:
        auth_header = request.headers.get("Authorization")
        token = None
        
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        elif request.cookies.get("access_token"):
            token = request.cookies.get("access_token")

        if not token:
            return JSONResponse({"detail": "Missing authentication token"}, status_code=401)

        try:
            payload = decode_jwt_token(token)
        except Exception:
            return JSONResponse({"detail": "Invalid token"}, status_code=401)

        user_id = payload.get("user_id")
        if not user_id:
            return JSONResponse({"detail": "Invalid token payload"}, status_code=401)

        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            return JSONResponse({"detail": "User not found"}, status_code=404)

        request.state.user = db_user
        return await call_next(request)
    finally:
        db.close()
