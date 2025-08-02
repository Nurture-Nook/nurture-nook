from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User
from schemas.posts import PostCreate, PostOut, PostDetailedOut, PostPatch
from schema.comments import CommentDetailedOut
from crud.post import create_post, get_post, get_detailed_post, get_comments_of_post, get_all_posts, update_post, delete_post
from utils.user import get_current_user
from typing import List
from pydantic import BaseModel
from db import get_db

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix = "/post", tags = [ "Post" ])

@router.post("/create", response_model=PostOut)
def create(post: PostCreate, db: Session = Depends(get_db)):
    return create_post(db, post)

@router.get("/posts", response_model=List[PostOut])
def get_posts(count: int = 20, skip: int = 0, db: Session = Depends(get_db)) -> List[PostOut]:
    posts = get_all_posts(db, skip = skip, limit = count)
    return posts

@router.get("/posts/{id}")
def get(id: int, db: Session = Depends(get_db)) -> PostDetailedOut:
    return get_detailed_post(db = db, post_id = id)

@router.get("/posts/{id}/preview")
def get_post_preview(id: int, db: Session = Depends(get_db)) -> PostOut:
    return get_post(db = db, post_id = id)

@router.get("/posts/{id}/comments", response_model=List[CommentDetailedOut])
def get_comments(id: int, count: int = 50, skip: int = 0, db: Session = Depends(get_db)) -> List[CommentDetailedOut]:
    return get_comments_of_post(db = db, post_id = id, skip = skip, limit = count)

@router.put("/posts/{id}")
def update(id: int, post_update: PostPatch, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        update_post(db = db, post_id = id, post_patch = post_update, current_user = current_user)

        return MessageResponse(message="Post updated successfully")
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"An error occurred while updating post: {str(e)}")

@router.delete("/posts/{id}")
def delete(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_post(db = db, post_id = id, current_user = current_user)

    return MessageResponse(message="Post deleted successfully")
