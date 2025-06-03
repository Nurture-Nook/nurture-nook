from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Comment
from schemas.posts import CommentCreate, CommentOut, CommentDetailedOut, CommentPatch
from crud.post import create_comment, get_comment, get_all_comments, update_comment, delete_comment
from utils.user import get_current_user
from typing import List
from pydantic import BaseModel
from db import get_db

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix = "/comment", tags = [ "Comment" ])

@router.post("/create", response_model=CommentOut)
def create(comment: CommentCreate, db: Session = Depends(get_db)):
    return create_comment(db, comment)

@router.get("/comments", response_model=List[CommentOut])
def get_comments(count: int = 20, skip: int = 0, db: Session = Depends(get_db)) -> List[CommentOut]:
    comments = get_all_comments(db, skip = skip, limit = count)
    return comments

@router.get("/comments/{id}", response_model=CommentOut)
def get(id: int, db: Session = Depends(get_db)) -> CommentOut:
    return get_comment(db = db, comment_id = id)

@router.put("/comments/{id}")
def update(id: int, comment_update: CommentPatch, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        update_comment(db = db, comment_id = id, comment_patch = comment_update, current_user_id = current_user.id)

        return MessageResponse(message="Comment updated successfully")
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"An error occurred while updating comment: {str(e)}")

@router.delete("/comments/{id}")
def delete(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_comment(db = db, comment_id = id, current_user_id = current_user.id)

    return MessageResponse(message="Comment deleted successfully")
