from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..utils.auth import decode_jwt_token
from ..models import User

PUBLIC_PATHS = [
    "/",
    "/auth/register",
    "/auth/login",
    "/auth/test"
]

async def auth_middleware(request: Request, call_next):
    if request.url.path in PUBLIC_PATHS or request.method == "OPTIONS":
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse({"detail": "Missing Authentication Token"}, status_code=401)

    token = auth_header.split(" ")[1]

    try:
        payload = decode_jwt_token(token)
        request.state.user = payload
    except Exception as e:
        return JSONResponse({"detail": str(e)}, status_code=401)

    return await call_next(request)
