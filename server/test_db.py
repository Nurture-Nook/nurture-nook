#!/usr/bin/env python
import os
import sys
import time
from dotenv import load_dotenv
import psycopg2
import re

# Add the current directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("ERROR: DATABASE_URL is not set in the .env file")
    sys.exit(1)

# Extract connection parameters from DATABASE_URL without exposing credentials
host_match = re.search(r'@([^:]+):', DATABASE_URL)
host = host_match.group(1) if host_match else "unknown"
print(f"Testing connection to database host: {host}")

# Parse DATABASE_URL
pattern = r'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)'
match = re.match(pattern, DATABASE_URL)

if not match:
    print("ERROR: Invalid DATABASE_URL format")
    sys.exit(1)

username, password, host, port, dbname = match.groups()
port = int(port)

print(f"Connecting to PostgreSQL at {host}:{port}")
print(f"Database: {dbname}")
print(f"Username: {username}")

start_time = time.time()
try:
    conn = psycopg2.connect(
        dbname=dbname,
        user=username,
        password=password,
        host=host,
        port=port,
        connect_timeout=10
    )
    elapsed = time.time() - start_time
    print(f"SUCCESS! Connected to database in {elapsed:.2f} seconds")
    
    # Check if we can execute a query
    with conn.cursor() as cur:
        cur.execute("SELECT 1")
        result = cur.fetchone()
        print(f"Query result: {result}")
    
    conn.close()
except Exception as e:
    elapsed = time.time() - start_time
    print(f"ERROR: Failed to connect after {elapsed:.2f} seconds")
    print(f"Error details: {e}")
    
    # Check if we can ping the host
    print(f"\nTrying to ping {host}...")
    os.system(f"ping -c 3 {host}")
