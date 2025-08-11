from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Comment, Post, User
from schemas.posts import PostCreate, PostDetailedOut, PostOut, PostPatch, PostModPatch, PostModView
from schemas.comments import CommentOut
from crud.temporary_username import create_alias
from typing import List
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# CREATE
def create_post(db: Session, post: PostCreate) -> PostOut:
    if not post.title.strip():
        raise HTTPException(status_code = 400, detail = "Empty Post Title")

    if not post.description.strip():
        raise HTTPException(status_code = 400, detail = "Empty Post Description")

    db_post = Post(
        title=post.title,
        description=post.description,
        categories=post.categories,
        warnings=post.warnings,
        user_id=post.user_id
    )

    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    db_post.temporary_username=create_alias(db, db_post.user_id, db_post.id)
    db.commit()
    db.refresh(db_post)

    logger.info(f"Post {db_post.id} created by user '{db_post.user_id}'")

    return PostOut.model_config(db_post)

# READ
def get_post_model(db: Session, post_id: int) -> Post:
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code = 404, detail = "Post not Found")
    return db_post

def get_post(db: Session, post_id: int) -> PostOut:
    return PostOut.model_config(get_post_model(db, post_id))

def get_detailed_post(db: Session, post_id: int) -> PostDetailedOut:
    return PostDetailedOut.model_config(get_post_model(db, post_id))

def get_post_as_mod(db: Session, post_id: int) -> PostModView:
    return PostModView.model_config(get_post_model(db, post_id))

def get_all_posts(db: Session, skip: int = 0, limit: int = 100) -> List[PostOut]:
    return [PostOut.model_config(post) for post in db.query(Post).offset(skip).limit(limit).all()]

def get_comments_of_post(db: Session, post_id: int, skip: int = 0, limit: int = 100) -> List[CommentOut]:
    return [CommentOut.model_config(comment) for comment in db.query(Comment).filter(Comment.post_id == post_id).offset(skip).limit(limit).all()]

# UPDATE
def update_post(db: Session, post_id: int, post_patch: PostPatch, current_user: User) -> PostOut:
    db_post = get_post_model(db, post_id)

    if db_post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to update this post")

    updates = { key: value for key, value in post_patch.dict(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_post, attr, value)

    db.commit()
    db.refresh(db_post)

    logger.info(f"Post {post_id} updated by user {db_post.temporary_username} with changes: {updates}")

    return PostOut.model_config(db_post)

def update_post_as_mod(db: Session, post_id: int, post_patch: PostModPatch) -> PostModView:
    db_post = get_post_model(db, post_id)

    updates = { key: value for key, value in post_patch.dict(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_post, attr, value)

    db.commit()
    db.refresh(db_post)

    logger.info(f"Post '{post_id}' updated by moderator with changes: {updates}")

    return PostModView.model_config(db_post)

# DELETE
def delete_post(db: Session, post_id: int, current_user: User) -> PostOut:
    db_post = get_post_model(db, post_id)

    if db_post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this post")

    db_post.title = "[deleted]"
    db_post.description = "[deleted]"
    db_post.is_deleted = True

    db.commit()
    db.refresh(db_post)

    logger.info(f"Post {post_id} soft deleted")

    return PostOut.model_validate(db_post)

def delete_post_as_mod(db: Session, post_id: int, current_user: User):
    db_post = db.query(Post).filter(Post.id == post_id).first()

    if not db_post:
        raise HTTPException(status_code=404, detail="Post Not Found")

    if db_post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You Are Not Authorized to Delete This Post")

    db.query(Comment).filter(Comment.post_id == post_id).delete(synchronize_session=False)

    db.delete(db_post)
    db.commit()

    logger.info(f"Post {post_id} and its comments deleted by user {current_user.id}")

    return {"message": "Post and Associated Comments Deleted Successfully"}
