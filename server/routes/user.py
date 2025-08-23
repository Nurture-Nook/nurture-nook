from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ..models import User
from ..schemas.users import UserPrivateOut, ProfileUpdateRequest, UsernameUpdateRequest, EmailVerificationRequest, PasswordUpdateRequest, UserDeleteRequest
from ..schemas.posts import PostOut
from ..schemas.comments import CommentOut
from ..schemas.chats import ChatOpen
from ..crud.user import update_username, update_password, update_email, delete_own_account, get_posts_by_user, get_comments_by_user, get_chats_of_user
from ..utils.user import get_current_user
from pydantic import BaseModel
from typing import List
from ..db import get_db

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/me")
def get_my_user_data(current_user: User = Depends(get_current_user)) -> UserPrivateOut:
    return UserPrivateOut.model_validate(current_user)

@router.get("/me/posts", response_model=List[PostOut])
def get_my_posts(skip: int = 0, limit: int = 50, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> List[PostOut]:
    return get_posts_by_user(skip = skip, limit = limit, user_id = current_user.id, db = db)

@router.get("/me/comments", response_model=List[CommentOut])
def get_my_comments(skip: int = 0, limit: int = 50, current_user: User = Depends(get_current_user), db : Session = Depends(get_db)) -> List[CommentOut]:
    return get_comments_by_user(skip = skip, limit = limit, user_id = current_user.id, db = db)

@router.get("/me/chats", response_model=List[ChatOpen])
def get_my_chats(skip: int = 0, limit: int = 50, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> List[ChatOpen]:
    return get_chats_of_user(skip = skip, limit = limit, user_id = current_user.id, db = db)

@router.put("/me/update_profile", response_model = MessageResponse)
def update_profile(profile_update: ProfileUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> MessageResponse:
    try:
        if profile_update.new_username:
            update_username(db, current_user.id, UsernameUpdateRequest(new_username=profile_update.new_username))

        if profile_update.new_email and profile_update.email_token:
            update_email(db, current_user, EmailVerificationRequest(new_email=profile_update.new_email, token=profile_update.email_token))

        if profile_update.current_password and profile_update.new_password:
            update_password(db, current_user.id, PasswordUpdateRequest(current_password=profile_update.current_password, new_password=profile_update.new_password))

        return MessageResponse(message="Profile updated successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while updating profile: {str(e)}")

@router.delete("/me/delete_account", response_model = MessageResponse)  # <-- change route to /me/delete_account
def delete_account(
    user_delete: UserDeleteRequest = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> MessageResponse:
    # Token requirement removed for now
    # delete_own_account(db, current_user, user_delete)
    # Instead, just verify password
    from fastapi import HTTPException
    from ..utils.auth import verify_password
    if not verify_password(user_delete.password, current_user.hashed_pass):
        raise HTTPException(status_code=403, detail="Incorrect Password")
    # Proceed with deletion
    from ..crud.user import delete_all_content
    delete_all_content(db, user_id=current_user.id)
    db.delete(current_user)
    db.commit()
    return MessageResponse(message="Profile deleted successfully")
