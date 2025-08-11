from fastapi import HTTPException, Depends, Query
from server.db import SessionLocal
from sqlalchemy.orm import Session
from models import User, Post, Comment, Chat
from schemas.users import UserCreate, UserOut, UserPrivateOut, EmailVerificationRequest, UsernameUpdateRequest, PasswordUpdateRequest, UserDeleteRequest
from schemas.posts import PostOut
from schemas.comments import CommentOut
from schemas.chats import ChatOpen
from services.email import send_verification
from utils.auth import generate_token, hash_token, hash_password, verify_password, compare_tokens
from typing import List, Optional
from datetime import datetime, timedelta
import logging, re

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

username_pattern = re.compile(r'^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9_]{3,15}$')
password_pattern = re.compile(r'^(?=(.*[a-zA-Z]){5,})(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$')
email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$')

# CREATE
def create_user(db: Session, user: UserCreate) -> UserPrivateOut:
    validate_username(db, user.username)

    validate_password(db, user.password)

    validate_email(user.email)

    original_email = user.email

    db_user = User(
        username=user.username,
        email="",
        hashed_pass=hash_password(user.password),
        email_verified=False
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    set_token(db, db_user, original_email, "email")

    return UserPrivateOut.from_orm(db_user)


# READ
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user(db: Session, user_id: int) -> UserOut:
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code = 404, detail="User not Found")
    return UserOut.from_orm(db_user)

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def get_users(skip: int = Query(0, ge=0), limit: int = Query(10, le=100), db: Session = Depends(get_db)):
    return db.query(User).offset(skip).limit(limit).all()

def get_posts_by_user(user_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)) -> List[PostOut]:
    posts = db.query(Post).filter(Post.user_id == user_id).offset(skip).limit(limit).all()
    return [PostOut.from_orm(post) for post in posts]

def get_comments_by_user(user_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)) -> List[CommentOut]:
    comments = db.query(Comment).filter(Comment.user_id == user_id).offset(skip).limit(limit).all()
    return [CommentOut.from_orm(comment) for comment in comments]

def get_chats_of_user(user_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)) -> List[ChatOpen]:
    chats = db.query(Chat).filter(Chat.user_id == user_id).offset(skip).limit(limit).all()
    return [ChatOpen.from_orm(chat) for chat in chats]

# UPDATE
def update_username(db: Session, user_id: int, username_update: UsernameUpdateRequest) -> Optional[User]:
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code = 404, detail = "User not Found")

    validate_username(db, username_update.new_username)

    db_user.username = username_update.new_username

    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        logger.error(f"Database commit failed for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    logger.info(f"User {user_id} successfully updated their username to {db_user.username}'.")

    return db_user

def update_password(db: Session, user_id: int, password_update: PasswordUpdateRequest) -> dict:
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code = 404, detail = "User not Found")

    if not verify_password(password_update.current_password, db_user.hashed_pass):
        raise HTTPException(status_code = 401, detail = "Incorrect Current Password")

    validate_password(password_update.new_password)

    db_user.hashed_pass = hash_password(password_update.new_password)

    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        logger.error(f"Database commit failed for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    logger.info(f"User {user_id} successfully updated their password.")

    return { "message": "Password Updated Successfully" }

def update_email(db: Session, current_user: User, email_verify: EmailVerificationRequest):
    validate_email(email_verify.new_email)
    validate_token(db, current_user, email_verify.token)
    current_user.email = email_verify.new_email
    try:
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        logger.error(f"Database commit failed for user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# DELETE
def delete_user(db: Session, user_id: int) -> UserOut:
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code = 404, detail = "User not Found")

    db.delete(db_user)
    db.commit()

    return UserOut.from_orm(db_user)

def delete_own_account(db: Session, current_user: User, user_delete: UserDeleteRequest) -> UserPrivateOut:
    if not verify_password(user_delete.password, current_user.hashed_pass):
        raise HTTPException(status_code = 403, detail = "Incorrect Password")

    validate_token(db, current_user, user_delete.token)

    user_private_out = UserPrivateOut.from_orm(current_user)

    db.delete(current_user)
    db.commit()
    return user_private_out

# Validate
def validate_username(db: Session, username: str) -> bool:
    if not username_pattern.match(username):
        logger.warning(f"Username Validation Failed: {username}")
        raise HTTPException(status_code = 400, detail = "Invalid Username: must be alphanumeric or with underscores, with at least three letters and between three and 15 characters (inclusive)")

    if get_user_by_username(db, username):
        logger.warning(f"Duplicate Username Attempt: {username}")
        raise HTTPException(status_code = 400, detail = "Invalid Username: must be unique")

    return True

def validate_password(password: str) -> bool:
    if not password_pattern.match(password):
        logger.warning(f"Password Validation Failed: {password}")
        raise HTTPException(status_code = 400, detail = "Invalid Password: must be between eight to 15 characters (inclusive), containing at least five letters, one number, and one special character: !@#$%^&*")

    return True

def validate_email(email: str) -> bool:
    if not email_pattern.match(email):
        logger.warning(f"Email Validation Failed: {email}")
        raise HTTPException(status_code = 400, detail = "Invalid Email: must adhere to standard email format")

    return True

def set_token(db: Session, user: User, email: str, purpose: str) -> str:
    token = generate_token()
    send_verification(user.username, email, purpose, token)
    user.hashed_token = hash_token(token)
    user.token_expiry = datetime.now() + timedelta(minutes=15)
    db.commit()
    return token

def validate_token(db: Session, user: User, submitted_token: str) -> bool:
    if not user.token_expiry or user.token_expiry < datetime.now():
        raise HTTPException(status_code = 403, detail = "Token Expired")

    if not compare_tokens(submitted_token, user.hashed_token):
        raise HTTPException(status_code = 403, detail = "Invalid Token")

    user.hashed_token = None
    user.token_expiry = None
    db.commit()
    return True
