from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from starlette.responses import JSONResponse
from ..utils.auth import decode_jwt_token

PUBLIC_PATHS = [
    "/auth/register",
    "/auth/login"
]

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "Accept"],
    )

async def auth_middleware(request: Request, call_next):
    if request.url.path in PUBLIC_PATHS or request.method == "OPTIONS":
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse({"detail": "Missing authentication token"}, status_code=401)

    token = auth_header.split(" ")[1]

    try:
        payload = decode_jwt_token(token)
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=401)

    request.state.user = payload

    return await call_next(request)
