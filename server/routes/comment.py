from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas.comments import CommentOut
from ..crud.comment import get_all_comments
from typing import List
from pydantic import BaseModel
from ..db import get_db

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix = "/comment", tags = [ "Comment" ])

@router.get("/comments", response_model=List[CommentOut])
def get_comments(count: int = 20, skip: int = 0, db: Session = Depends(get_db)) -> List[CommentOut]:
    try:
        print(f"GET /comment/comments - params: count={count}, skip={skip}")

        comments = get_all_comments(db, skip=skip, limit=count)

        print(f"Retrieved {len(comments)} comments")

        return { "comments": comments }
    except Exception as e:
        print(f"Error in GET /comment/comments: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
