from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from .models import Base
import os
import re

# Debug: Print current working directory to see where Python is looking for files
print(f"Current working directory: {os.getcwd()}")
print(f"Server directory: {os.path.dirname(os.path.abspath(__file__))}")

# Try to load .env from the server directory specifically
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
print(f"Looking for .env at: {dotenv_path}")
print(f"Does .env file exist? {os.path.exists(dotenv_path)}")

load_dotenv(dotenv_path=dotenv_path)
# Also try to load from the current working directory as a fallback
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

# Debug info without exposing credentials
if DATABASE_URL:
    # Extract host from DATABASE_URL
    host_match = re.search(r'@([^:]+):', DATABASE_URL)
    host = host_match.group(1) if host_match else "unknown"
    print(f"Attempting to connect to database host: {host}")
else:
    print("WARNING: DATABASE_URL is not set!")

engine = create_engine(DATABASE_URL, echo=True)

# Add timeout for connection attempts
from sqlalchemy.pool import Pool

@event.listens_for(Pool, "checkout")
def checkout(dbapi_connection, connection_record, connection_proxy):
    print("Attempting database connection...")

SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)

Base.metadata.create_all(bind=engine)

print("database created")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
