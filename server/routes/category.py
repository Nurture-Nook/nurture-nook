from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from ..schemas.posts import PostOut
from ..crud.category import get_category_with_posts, get_all_categories, get_posts_of_category
from typing import List, Optional
from pydantic import BaseModel
from ..db import get_db

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix = "/category", tags = [ "Category" ])

@router.get("/categories")
def get_categories(count: int = 20, skip: int = 0, db: Session = Depends(get_db), title: Optional[str] = Query(None)):
    try:
        print(f"GET /category/categories - params: count={count}, skip={skip}, title={title}")
        
        categories = get_all_categories(db, skip=skip, limit=count)
        
        print(f"Retrieved {len(categories)} categories")

        if title:
            results = [c for c in categories if c.title.lower() == title.lower()]
            if not results:
                raise HTTPException(status_code=404, detail="Category Not Found")
            return {"categories": results}

        return {"categories": categories}
    except Exception as e:
        print(f"Error in GET /category/categories: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/categories/{id}")
def get(id: int, db: Session = Depends(get_db)):
    try:
        print(f"GET /category/categories/{id}")
        category_data = get_category_with_posts(db=db, category_id=id)
        
        # Convert to dict to avoid Pydantic validation issues
        if category_data:
            # Ensure all necessary fields are present
            category_dict = {
                "id": category_data.id if hasattr(category_data, "id") else id,
                "title": category_data.title if hasattr(category_data, "title") else "",
                "description": category_data.description if hasattr(category_data, "description") else "",
                "posts": category_data.posts if hasattr(category_data, "posts") else []
            }
            return category_dict
        else:
            raise HTTPException(status_code=404, detail="Category not found")
    except Exception as e:
        print(f"Error in GET /category/categories/{id}: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/categories/{id}/posts")
def get_posts(id: int, count: int = 50, skip: int = 0, db: Session = Depends(get_db)) -> List[PostOut]:
    return get_posts_of_category(db = db, category_id = id, skip = skip, limit = count)
