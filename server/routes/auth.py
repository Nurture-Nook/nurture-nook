from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from ..schemas.users import UserCreate, UserLogin
from ..crud.user import create_user, get_user_by_email, get_user_by_username, get_user_by_id
from ..services.auth import authenticate_user
from ..utils.auth import generate_jwt_token, decode_jwt_token
from fastapi.responses import JSONResponse
from ..db import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    if not user_create.email or user_create.email.strip() == "":
        raise HTTPException(status_code=400, detail="Email Cannot Be Empty")
        
    if get_user_by_username(db, user_create.username):
        raise HTTPException(status_code=400, detail="Username Already Registered")
    
    if get_user_by_email(db, user_create.email):
        raise HTTPException(status_code=400, detail="Email Already Registered")

    user = create_user(db, user_create)
    
    access_token = generate_jwt_token(user.id)
    
    return {
        "message": "Registration Successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Username or Password")

    access_token = generate_jwt_token(user.id)
    
    return {
        "message": "Login Successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }

@router.get("/me")
def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
    token = authorization.split(" ")[1]
    
    try:
        payload = decode_jwt_token(token)
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        user = get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@router.get("/test")
def test_endpoint():
    return {"message": "Auth API is working!"}
