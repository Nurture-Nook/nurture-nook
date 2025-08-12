import os
import uuid
import jwt
import hashlib
import datetime
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is missing! Set it in .env")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

def generate_jwt_token(user_id: int) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.now() + datetime.timedelta(hours=1),
        "iat": datetime.datetime.now(),
        "iss": "nurture_nook"
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def generate_token() -> str:
    return uuid.uuid4().hex

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

def compare_tokens(plain_token: str, hashed_token: str, is_password: bool = False) -> bool:
    if is_password:
        return pwd_context.verify(plain_token, hashed_token)
    return hashlib.sha256(plain_token.encode()).hexdigest() == hashed_token

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def decode_jwt_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
    except jwt.DecodeError:
        raise ValueError("Malformed token")
