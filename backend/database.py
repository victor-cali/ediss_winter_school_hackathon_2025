# database.py - Database connection handling for PostgreSQL
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import config
import time
import psycopg2
import os

# Add function to wait for PostgreSQL to be available
def wait_for_postgres():
    """Wait for PostgreSQL to become available."""
    max_retries = 30
    retry_interval = 2  # seconds
    
    host = os.environ.get('DB_HOST', 'postgres')
    port = os.environ.get('DB_PORT', '5432')
    user = os.environ.get('DB_USER', 'postgres')
    password = os.environ.get('DB_PASSWORD', 'postgres')
    dbname = os.environ.get('DB_NAME', 'edgedevicedb')
    
    for attempt in range(max_retries):
        try:
            conn = psycopg2.connect(
                host=host,
                port=port,
                user=user,
                password=password,
                dbname=dbname
            )
            conn.close()
            print("Successfully connected to PostgreSQL")
            return True
        except psycopg2.OperationalError as e:
            print(f"Waiting for PostgreSQL to become available... (Attempt {attempt+1}/{max_retries})")
            print(f"Error: {e}")
            time.sleep(retry_interval)
    
    print("Failed to connect to PostgreSQL after multiple attempts")
    return False

# Wait for PostgreSQL to be available before setting up the engine
wait_for_postgres()

# Create database engine with connection pooling configurations
engine = create_engine(
    config.DATABASE_URI,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    pool_pre_ping=True
)

# Create scoped session
db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

# Base class for all models
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    """Initialize the database, creating all tables."""
    # Import all modules here that define models
    import models
    Base.metadata.create_all(bind=engine)