from crud.user import get_user
from sqlalchemy.orm import Session
from models import User
from utils.auth import verify_password

def authenticate_user(db: Session, username: str, password: str):
    try:
        user = get_user(db, username)
    except HTTPException:  
        return None

    if not verify_password(password, user.hashed_password):
        return None
    return user
