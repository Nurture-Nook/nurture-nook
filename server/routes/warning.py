from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..schemas.posts import PostOut
from ..crud.warning import get_all_warnings, get_warning_with_posts, get_posts_of_warning
from typing import List, Optional
from pydantic import BaseModel
from ..db import get_db

class MessageResponse(BaseModel):
    message: str

router = APIRouter(prefix = "/warning", tags = [ "Warning" ])

@router.get("/warnings")
def get_warnings(count: int = 20, skip: int = 0, db: Session = Depends(get_db), title: Optional[str] = Query(None)):
    try:
        print(f"GET /warning/warnings - params: count={count}, skip={skip}, title={title}")
        
        warnings = get_all_warnings(db, skip = skip, limit = count)
        
        print(f"Retrieved {len(warnings)} warnings")

        if title:
            results = [w for w in warnings if w.title.lower() == title.lower()]
            if not results:
                raise HTTPException(status_code=404, detail="Warning Not Found")
            return {"warnings": results}

        return {"warnings": warnings}
    except Exception as e:
        print(f"Error in GET /warning/warnings: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/warnings/{id}")
def get(id: int, db: Session = Depends(get_db)):
    try:
        print(f"GET /warning/warnings/{id}")
        warning = get_warning_with_posts(db=db, warning_id=id)
        return warning
    except Exception as e:
        print(f"Error in GET /warning/warnings/{id}: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/warnings/{id}/posts")
def get_posts(id: int, count: int = 50, skip: int = 0, db: Session = Depends(get_db)) -> List[PostOut]:
    return get_posts_of_warning(db = db, warning_id = id, skip = skip, limit = count)
