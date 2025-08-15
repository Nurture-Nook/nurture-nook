import logging
from fastapi import Request
INFO = logging.INFO

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def getLogger(name):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    return logger

async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response
