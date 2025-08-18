from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import User
from ..schemas.posts import PostCreate, PostOut, PostDetailedOut, PostPatch
from ..schemas.comments import CommentCreate, CommentOut, CommentPatch
from ..crud.post import create_post, get_post, get_detailed_post, get_comments_of_post, get_all_posts, update_post, delete_post
from ..crud.comment import create_comment, get_comment, update_comment, delete_comment
from ..utils.user import get_current_user
from typing import List, Optional
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
def get_posts(count: int = 20, skip: int = 0, db: Session = Depends(get_db), title: Optional[str] = None) -> List[PostOut]:
    try:
        print(f"GET /post/posts - params: count={count}, skip={skip}, title={title}")

        posts = get_all_posts(db, skip = skip, limit = count)

        print(f"Retrieved {len(posts)} posts")

        if title:
            results = [p for p in posts if p.title.lower() == title.lower()]
            
            if not results:
                raise HTTPException(status_code=404, detail="Post Not Found")
            
            return {"posts": results}
        return { "posts": posts }
    except Exception as e:
        print(f"Error in GET /post/posts: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/posts/{id}")
def get(id: int, db: Session = Depends(get_db)) -> PostDetailedOut:
    try:
        print(f"GET /post/posts/{id}")
        post_data = get_detailed_post(db=db, post_id=id)

        if post_data:
            post_dict = {
                "id": post_data.id if hasattr(post_data, "id") else id,
                "user_id": post_data.user_id if hasattr(post_data, "user_id") else None,
                "title": post_data.title if hasattr(post_data, "title") else "",
                "description": post_data.description if hasattr(post_data, "description") else "",
                "temporary_username": post_data.temporary_username if hasattr(post_data, "temporary_username") else None,
                "categories": post_data.categories if hasattr(post_data, "categories") else [],
                "warnings": post_data.warnings if hasattr(post_data, "warnings") else [],
                "comments": post_data.comments if hasattr(post_data, "comments") else [],
                "author": post_data.author if hasattr(post_data, "author") else None
            }
            return post_dict
        else:
            raise HTTPException(status_code=404, detail="Post not Found")
    except Exception as e:
        print(f"Error in GET /post/posts/{id}: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/posts/{id}/preview")
def get_post_preview(id: int, db: Session = Depends(get_db)) -> PostOut:
    try:
        print(f"GET /post/posts/{id}")
        post_data = get_post(db=db, post_id=id)
        
        if post_data:
            post_dict = {
                "id": post_data.id if hasattr(post_data, "id") else id,
                "title": post_data.title if hasattr(post_data, "title") else "",
                "warnings": post_data.warnings if hasattr(post_data, "warnings") else [],
                "created_at": post_data.created_at if hasattr(post_data, "created_at") else None
            }

            return post_dict
        else:
            raise HTTPException(status_code=404, detail="Post not Found")
    except Exception as e:
        print(f"Error in GET /post/posts/{id}: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/posts/{id}/comments", response_model=List[CommentOut])
def get_comments(id: int, count: int = 50, skip: int = 0, db: Session = Depends(get_db)) -> List[CommentOut]:
    try:
        print(f"GET /post/{id}/comments - params: count={count}, skip={skip}")

        comments = get_comments_of_post(db, post_id=id, skip=skip, limit=count)

        print(f"Retrieved {len(comments)} comments")

        return { "comments": comments }
    except Exception as e:
        print(f"Error in GET /post/{id}/comments: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("posts/{id}/comments/{comment_id}", response_model=CommentOut)
def get(comment_id: int, db: Session = Depends(get_db)) -> CommentOut:
    try:
        print(f"GET /post/{id}/comments/{comment_id}")
        comment_data = get_comment(db=db, comment_id=comment_id)

        if comment_data:
            comment_dict = {
                "id": comment_data.id if hasattr(comment_data, "id") else comment_id,
                "user_id": comment_data.user_id if hasattr(comment_data, "user_id") else None,
                "post_id": comment_data.post_id if hasattr(comment_data, "post_id") else id,
                "temporary_username": comment_data.temporary_username if hasattr(comment_data, "temporary_username") else None,
                "content": comment_data.content if hasattr(comment_data, "content") else "",
                "warnings": comment_data.warnings if hasattr(comment_data, "warnings") else [],
                "parent_comment_id": comment_data.parent_comment_id if hasattr(comment_data, "parent_comment_id") else None,
                "created_at": comment_data.created_at if hasattr(comment_data, "created_at") else None
            }
            return comment_dict
        else:
            raise HTTPException(status_code=404, detail="Comment not Found")
    except Exception as e:
        print(f"Error in GET /post/posts/{id}/comments/{comment_id}: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.put("/posts/{id}")
def update(id: int, post_update: PostPatch, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        updated_post = update_post(db=db, post_id=id, post_patch=post_update, current_user=current_user)
        
        if updated_post:
            return updated_post
    except Exception as e:
        print(f"Error updating post: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"An error occurred while updating post: {str(e)}")
    
@router.put("/posts/{id}/comments/{comment_id}")
def update(comment_id: int, comment_update: CommentPatch, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        updated_comment = update_comment(db=db, comment_id=comment_id, comment_patch=comment_update, current_user_id=current_user.id)
        
        if updated_comment:
            return updated_comment

        return MessageResponse(message="Comment Updated Successfully")
    except Exception as e:
        print(f"Error Updating Comment: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"An Error Occurred While Updating Comment: {str(e)}")

@router.delete("/posts/{id}")
def delete(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_post(db = db, post_id = id, current_user = current_user)

    return MessageResponse(message="Post Deleted Successfully")

@router.delete("/posts/{id}/comments/{comment_id}")
def delete(comment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_comment(db = db, comment_id = comment_id, current_user_id = current_user.id)

    return MessageResponse(message="Comment Deleted Successfully")
