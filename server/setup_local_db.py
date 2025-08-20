#!/usr/bin/env python
import os
from dotenv import load_dotenv

# Load the current .env
load_dotenv()

# Get the current DATABASE_URL
current_db_url = os.getenv('DATABASE_URL', '')

# Create a backup of the current DATABASE_URL in the .env file
with open('.env', 'r') as file:
    lines = file.readlines()

with open('.env.bak', 'w') as file:
    file.writelines(lines)
    
# Create a new .env file with SQLite configuration for local development
with open('.env', 'r') as file:
    lines = file.readlines()

updated = False
with open('.env.local', 'w') as file:
    for line in lines:
        if line.startswith('DATABASE_URL='):
            file.write('# Original PostgreSQL Database\n')
            file.write(f'# {line.strip()}\n')
            file.write('# Local SQLite Database for development\n')
            file.write('DATABASE_URL=sqlite:///./nurture_nook.db\n')
            updated = True
        else:
            file.write(line)
    
    if not updated:
        file.write('# Local SQLite Database for development\n')
        file.write('DATABASE_URL=sqlite:///./nurture_nook.db\n')

print("Created .env.local with SQLite configuration for local development.")
print("To use the SQLite database, run: cp .env.local .env")
print("To restore the original PostgreSQL settings, run: cp .env.bak .env")
