from fastapi import Request, HTTPException
from utils.user import get_current_user

async def auth_middleware(request: Request, call_next):
    current_user = get_current_user(request)
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    response = await call_next(request)
    return response
