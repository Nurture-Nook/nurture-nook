from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import User
from ..schemas.posts import PostCreate, PostOut, PostDetailedOut, PostPatch
from ..schemas.comments import CommentCreate, CommentOut, CommentPatch
from ..crud.post import create_post, get_post, get_detailed_post, get_comments_of_post, get_all_posts, update_post, delete_post
from ..crud.comment import create_comment, get_comment, update_comment, delete_comment
from ..utils.user import get_current_user
from typing import List
from pydantic import BaseModel
from ..db import get_db

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix = "/post", tags = [ "Post" ])

@router.post("/create", response_model=PostOut)
def create(post: PostCreate, db: Session = Depends(get_db)):
    return create_post(db, post)

@router.post("/posts/{id}/comments/create", response_model=CommentOut)
def create(comment: CommentCreate, db: Session = Depends(get_db)):
    return create_comment(db, comment)

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

@router.get("/posts/{id}/comments", response_model=List[CommentOut])
def get_comments(id: int, count: int = 50, skip: int = 0, db: Session = Depends(get_db)) -> List[CommentOut]:
    return get_comments_of_post(db = db, post_id = id, skip = skip, limit = count)

@router.get("posts/{id}/comments/{comment_id}", response_model=CommentOut)
def get(comment_id: int, db: Session = Depends(get_db)) -> CommentOut:
    return get_comment(db = db, comment_id = comment_id)

@router.put("/posts/{id}")
def update(id: int, post_update: PostPatch, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        update_post(db = db, post_id = id, post_patch = post_update, current_user = current_user)

        return MessageResponse(message="Post updated successfully")
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"An error occurred while updating post: {str(e)}")
    
@router.put("/posts/{id}/comments/{comment_id}")
def update(comment_id: int, comment_update: CommentPatch, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        update_comment(db = db, comment_id = comment_id, comment_patch = comment_update, current_user_id = current_user.id)

        return MessageResponse(message="Comment updated successfully")
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"An error occurred while updating comment: {str(e)}")

@router.delete("/posts/{id}")
def delete(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_post(db = db, post_id = id, current_user = current_user)

    return MessageResponse(message="Post deleted successfully")

@router.delete("/posts/{id}/comments/{comment_id}")
def delete(comment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_comment(db = db, comment_id = comment_id, current_user_id = current_user.id)

    return MessageResponse(message="Comment deleted successfully")
