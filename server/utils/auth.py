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
        print(f"Decoding JWT token: {token[:10]}...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        print(f"JWT payload: {payload}")
        return payload
    except jwt.ExpiredSignatureError:
        print("JWT error: Token has expired")
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError as e:
        print(f"JWT error: Invalid or malformed token - {str(e)}")
        raise ValueError("Invalid or malformed token")
    except Exception as e:
        print(f"Unexpected JWT error: {str(e)}")
        raise ValueError(f"Error decoding token: {str(e)}")


def get_token_from_request(request):
    """
    Extract JWT token from the request cookies or Authorization header.

    Args:
        request: The FastAPI request object

    Returns:
        str: The token if found, None otherwise
    """
    # First check for token in cookies
    token = request.cookies.get("access_token")

    # If not in cookies, try Authorization header
    if not token and "Authorization" in request.headers:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    # Debug output to help troubleshoot
    print(f"Token source: {'cookie' if token and token == request.cookies.get('access_token') else 'header' if token else 'none'}")

    return token
