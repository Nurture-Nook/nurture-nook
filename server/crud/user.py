from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate, EmailVerificationRequest, UsernameUpdateRequest, PasswordUpdateRequest, UserDeleteRequest
from utils.email import send_verification
from utils.auth import generate_token, hash_token, hash_password, verify_password, compare_tokens
from datetime import datetime, timedelta

# Create
def create_user(db: Session, user: UserCreate):
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

    return db_user


# Read
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_all_users(db: Session):
    return db.query(User).all()

# Update
def update_username(db: Session, user_id: int, username_update: UsernameUpdateRequest):
    db_user = db.query(User).filter(User.id == user_id).first()

    if db_user:
        db_user.username = username_update.new_username
        db.commit()
        db.refresh(db_user)

def update_password(db: Session, user_id: int, password_update: PasswordUpdateRequest):
    db_user = db.query(User).filter(User.id == user_id).first()

    if db_user and verify_password(password_update.current_password, db_user.hashed_pass):
        db_user.hashed_pass = hash_password(password_update.new_password)
        db.commit()
        db.refresh(db_user)

def update_email(db: Session, current_user: User, email_verify: EmailVerificationRequest):
    validate_token(db, current_user, email_verify.token)
    current_user.email = email_verify.new_email
    db.commit()
    db.refresh(current_user)

# Delete
def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()

    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def delete_own_account(db: Session, current_user: User, user_delete: UserDeleteRequest):
    if not verify_password(user_delete.password, current_user.hashed_pass):
        raise HTTPException(status_code = 403, detail = "Incorrect Password")

    validate_token(db, current_user, user_delete.token)
    db.delete(current_user)
    db.commit()
    return current_user

# Validate
def set_token(db: Session, user: User, email: str, purpose: str):
    token = generate_token()
    send_verification(user.username, email, purpose, token)
    user.hashed_token = hash_token(token)
    user.token_expiry = datetime.now() + timedelta(minutes=15)
    db.commit()
    return token

def validate_token(db: Session, user: User, submitted_token: str):
    if not user.token_expiry or user.token_expiry < datetime.now():
        raise HTTPException(status_code = 403, detail = "Token expired")

    if not compare_tokens(submitted_token, user.hashed_token):
        raise HTTPException(status_code = 403, detail = "Invalid token")

    user.hashed_token = None
    user.token_expiry = None
    db.commit()
    return True
