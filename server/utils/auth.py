import os
import uuid
import jwt
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is missing! Set it in .env")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_jwt_token(user_id: int, expires_hours: int = 1) -> str:
    now = datetime.now()
    payload: Dict[str, Any] = {
        "user_id": user_id,
        "exp": now + timedelta(hours=expires_hours),
        "iat": now,
        "iss": "nurture_nook",
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token if isinstance(token, str) else token.decode("utf-8")


def generate_token() -> str:
    return uuid.uuid4().hex


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def compare_tokens(plain_token: str, hashed_token: str, is_password: bool = False) -> bool:
    if is_password:
        return pwd_context.verify(plain_token, hashed_token)
    return hashlib.sha256(plain_token.encode("utf-8")).hexdigest() == hashed_token


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def decode_jwt_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid or malformed token")
    