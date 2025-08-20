from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..models import Comment, Post, User
from ..schemas.posts import PostCreate, PostDetailedOut, PostOut, PostPatch, PostModPatch, PostModView
from ..schemas.comments import CommentOut
from ..crud.temporary_username import create_alias
from typing import List
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# CREATE
def create_post(db: Session, post: PostCreate) -> PostOut:
    try:
        logger.info(f"Creating post with data: {post.model_dump()}")
        
        if not post.title.strip():
            raise HTTPException(status_code = 400, detail = "Empty Post Title")

        if not post.description.strip():
            raise HTTPException(status_code = 400, detail = "Empty Post Description")
        
        if not post.categories or len(post.categories) == 0:
            raise HTTPException(status_code = 400, detail = "Post Must Have at Least One Category")

        logger.info(f"Creating Alias for Post")

        import uuid
        temp_alias = f"user_{post.user_id}_{uuid.uuid4().hex[:8]}"
        
        db_post = Post(
            title=post.title,
            description=post.description,
            user_id=post.user_id,
            temporary_username=temp_alias
        )
        
        logger.info(f"Created Post Object with Temp Alias: {temp_alias}")
        db.add(db_post)
        
        try:
            db.flush()
            logger.info(f"Flushed Post, got ID: {db_post.id}")
            
            if post.categories:
                from ..models import Category
                logger.info(f"Fetching categories: {post.categories}")
                categories = db.query(Category).filter(Category.id.in_(post.categories)).all()
                if len(categories) != len(post.categories):
                    logger.warning(f"Some Categories not Found. Requested: {post.categories}, Found: {[c.id for c in categories]}")
                db_post.categories = categories
            
            if post.warnings:
                from ..models import ContentWarning
                logger.info(f"Fetching warnings: {post.warnings}")
                warnings = db.query(ContentWarning).filter(ContentWarning.id.in_(post.warnings)).all()
                if len(warnings) != len(post.warnings):
                    logger.warning(f"Some Warnings not Found. Requested: {post.warnings}, Found: {[w.id for w in warnings]}")
                db_post.warnings = warnings
            
            logger.info(f"Generating final alias for post ID {db_post.id}")
            final_alias = create_alias(db, db_post.user_id, db_post.id)
            db_post.temporary_username = final_alias
            
            db.commit()
            logger.info(f"Successfully Committed Post With ID {db_post.id} and Alias {final_alias}")
            
            db.refresh(db_post)
            
            logger.info(f"Creating PostOut Response With Post Data")
            post_out = PostOut(
                id=db_post.id,
                title=db_post.title,
                description=db_post.description,
                temporary_username=db_post.temporary_username,
                user_id=db_post.user_id,
                warnings=[w.id for w in db_post.warnings] if db_post.warnings else [],
                categories=[c.id for c in db_post.categories] if db_post.categories else [],
                created_at=db_post.created_at
            )
            logger.info(f"Successfully Created PostOut Response")
            return post_out
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error during Post Creation Transaction: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Database Transaction Error: {str(e)}")
    
    except HTTPException as http_exc:
        raise http_exc
        
    except Exception as e:
        logger.error(f"Unexpected Error in create_post: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error Creating Post: {str(e)}")

# READ
def get_post_model(db: Session, post_id: int) -> Post:
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code = 404, detail="Post not Found")
    if db_post.is_deleted:
        raise HTTPException(status_code = 410, detail="Post has been deleted")
    return db_post

def get_post(db: Session, post_id: int) -> PostOut:
    post = get_post_model(db, post_id)

    return PostOut(
        id=post.id,
        title=post.title,
        warnings=[w.id for w in post.warnings],
        created_at=post.created_at
    )

def get_detailed_post(db: Session, post_id: int) -> PostDetailedOut:
    post = get_post_model(db, post_id)

    return PostDetailedOut(
        id=post.id,
        user_id=post.user_id,
        title=post.title,
        description=post.description,
        temporary_username=post.temporary_username,
        categories=[c.id for c in post.categories],
        warnings=[w.id for w in post.warnings],
        comments=[c.id for c in post.comments],
        created_at=post.created_at,
    )

def get_post_as_mod(db: Session, post_id: int) -> PostModView:
    return PostModView.model_validate(get_post_model(db, post_id))

def get_all_posts(db: Session, skip: int = 0, limit: int = 100) -> List[PostOut]:
    return [PostOut.model_validate(post) for post in db.query(Post).filter(Post.is_deleted == False).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()]

def get_comments_of_post(db: Session, post_id: int, skip: int = 0, limit: int = 100) -> List[CommentOut]:
    post = get_post_model(db, post_id)  # This will check if the post exists and isn't deleted
    return [CommentOut.model_validate(comment) for comment in db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()]

# UPDATE
def update_post(db: Session, post_id: int, post_patch: PostPatch, current_user: User) -> PostOut:
    db_post = get_post_model(db, post_id)

    if db_post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not Authorized to Update This Post")

    updates = { key: value for key, value in post_patch.model_dump(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_post, attr, value)

    db.commit()
    db.refresh(db_post)

    logger.info(f"Post {post_id} updated by user {db_post.temporary_username} with changes: {updates}")

    return PostOut.model_validate(db_post)

def update_post_as_mod(db: Session, post_id: int, post_patch: PostModPatch) -> PostModView:
    db_post = get_post_model(db, post_id)

    updates = { key: value for key, value in post_patch.model_dump(exclude_unset=True, exclude_none=True).items() }
    for attr, value in updates.items():
        setattr(db_post, attr, value)

    db.commit()
    db.refresh(db_post)

    logger.info(f"Post '{post_id}' Updated by Moderator with Changes: {updates}")

    return PostModView.model_validate(db_post)

# DELETE
def delete_post(db: Session, post_id: int, current_user: User) -> PostOut:
    db_post = get_post_model(db, post_id)

    if db_post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You Are Not Authorized to Delete This Post")

    db_post.title = "[deleted]"
    db_post.description = "[deleted]"
    db_post.is_deleted = True

    db.commit()
    db.refresh(db_post)

    logger.info(f"Post {post_id} Soft Deleted")

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

    logger.info(f"Post {post_id} and its Comments Deleted by Moderator")

    return {"message": "Post and Associated Comments Deleted Successfully"}
