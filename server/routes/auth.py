from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.users import UserCreate, UserLogin
from crud.user import create_user, get_user_by_email, get_user_by_username
from services.auth import authenticate_user
from utils.auth import generate_jwt_token
from fastapi.responses import JSONResponse
from db import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user_create.email):
        raise HTTPException(status_code=400, detail="Email Already Registered")

    if get_user_by_username(db, user_create.username):
        raise HTTPException(status_code=400, detail="Username Not Available")

    user = create_user(db, user_create)
    access_token = generate_jwt_token(user.id)

    response = JSONResponse({"message": "Registration successful"})
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        secure=True, 
        samesite="Lax",
        max_age=3600
    )
    
    return response

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    access_token = generate_jwt_token(user.id)
    
    response = JSONResponse({"message": "Login successful"})
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        secure=True, 
        samesite="Lax",
        max_age=3600
    )
    
    return response
