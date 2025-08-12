from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import User
from schemas.comments import CommentOut
from crud.post import get_all_comments
from typing import List
from pydantic import BaseModel
from db import get_db

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix = "/comment", tags = [ "Comment" ])

@router.get("/comments", response_model=List[CommentOut])
def get_comments(count: int = 20, skip: int = 0, db: Session = Depends(get_db)) -> List[CommentOut]:
    comments = get_all_comments(db, skip = skip, limit = count)
    return comments
