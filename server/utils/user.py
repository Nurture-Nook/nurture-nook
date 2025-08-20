from fastapi import Depends, Request, HTTPException, Header
from sqlalchemy.orm import Session
from ..models import User
from ..utils.auth import decode_jwt_token
import logging
from ..db import get_db

logger = logging.getLogger(__name__)

def get_current_user(db: Session = Depends(get_db), authorization: str = Header(None)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authentication token")

    token = authorization.split(" ")[1]

    try:
        payload = decode_jwt_token(token)
        user_id = payload.get("user_id")
        db_user = db.query(User).filter(User.id == user_id).first()

        if not db_user:
            raise HTTPException(status_code=404, detail="User Not Found")

        return db_user
    except Exception as e:
        logger.warning(f"Token validation failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid Token")
