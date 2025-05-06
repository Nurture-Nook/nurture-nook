import uuid
import hashlib
from pydoc import plain
from pathlibs.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

def generate_token():
    return hashlib.sha256(uuid.uuid4()).hexdigest()

def verify_token(plain_token: str, hashed_token: str) => bool:
    return pwd_context.verify(plain_token, hashed_token)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
