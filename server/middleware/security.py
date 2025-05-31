from fastapi import Request, HTTPException

async def security_middleware(request: Request, call_next):
    if "malicious-header" in request.headers:
        raise HTTPException(status_code = 403, detail = "Forbidden request")

    response = await call_next(request)
    return response
