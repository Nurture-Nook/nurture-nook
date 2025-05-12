from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Post
from schemas import PostCreate, PostOut, PostPatch, PostModPatch, PostModView
from typing import List

# CREATE
def create_post(db: Session, post: PostCreate) -> PostOut:
    db_post = Post(
        title=post.title,
        description=post.description,
        categories=post.categories,
        warnings=post.warnings
    )

    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    return PostOut.from_orm(db_post)

# READ
def get_post_model(db: Session, post_id: int) -> Post:
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code = 404, detail="Post not Found")
    return db_post

def get_post(db: Session, post_id: int) -> PostOut:
    post = get_post_model(db, post_id)
    return PostOut.from_orm(post)

def get_post_as_mod(db: Session, post_id: int) -> PostModView:
    post = get_post_model(db, post_id)
    return PostModView.from_orm(post)

def get_all_posts(db: Session) -> List[PostOut]:
    return [PostOut.from_orm(post) for post in db.query(Post).all()]

# UPDATE
def update_post(db: Session, post_id: int, post_patch: PostPatch) -> PostOut:
    post = get_post_model(db, post_id)

    if post_patch.title is not None:
        post.title = post_patch.title
    if post_patch.description is not None:
        post.description = post_patch.description
    if post_patch.categories is not None:
        post.categories = post_patch.categories
    if post_patch.warnings is not None:
        post.warnings = post_patch.warnings

    db.commit()
    db.refresh(post)
    return PostOut.from_orm(post)

def update_post_as_mod(db: Session, post_id: int, post_patch: PostModPatch) -> PostModView:
    post = get_post_model(db, post_id)

    if post_patch.categories is not None:
        post.categories = post_patch.categories
    if post_patch.warnings is not None:
        post.warnings = post_patch.warnings
    if post_patch.flags is not None:
        post.flags = post_patch.flags
    if post_patch.is_flagged is not None:
        post.is_flagged = post_patch.is_flagged
    if post_patch.is_deleted is not None:
        post.is_deleted = post_patch.is_deleted

    db.commit()
    db.refresh(post)
    return PostModView.from_orm(post)

# DELETE
def delete_post(db: Session, post_id: int) -> PostOut:
    post = get_post_model(db, post_id)

    db.delete(post)
    db.commit()
    return PostOut.from_orm(post)
