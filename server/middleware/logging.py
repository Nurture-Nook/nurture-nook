import logging
from fastapi import Request

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response
