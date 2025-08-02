from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.categories import CategoryOut, CategoryWithPosts
from schemas.posts import PostOut
from crud.category import get_category_with_posts, get_all_categories, get_posts_of_category
from typing import List
from pydantic import BaseModel
from db import get_db

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix = "/category", tags = [ "Category" ])

@router.get("/categories", response_model=List[CategoryOut])
def get_categories(count: int = 20, skip: int = 0, db: Session = Depends(get_db)) -> List[CategoryOut]:
    categories = get_all_categories(db, skip = skip, limit = count)
    return categories

@router.get("/categories/{id}")
def get(id: int, db: Session = Depends(get_db)) -> CategoryWithPosts:
    return get_category_with_posts(db = db, category_id = id)

@router.get("/categories/{id}/posts")
def get_posts(id: int, count: int = 50, skip: int = 0, db: Session = Depends(get_db)) -> List[PostOut]:
    return get_posts_of_category(db = db, category_id = id, skip = skip, limit = count)
