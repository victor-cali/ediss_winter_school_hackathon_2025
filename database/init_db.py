import os
import psycopg2

# Database connection settings
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "mydatabase")
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DATA_PATH = os.getenv("DATA_PATH", "/data")
SCHEMA_FILE = "/app/schema.sql"

def connect_db():
    """Establish connection to PostgreSQL database."""
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

def initialize_database():
    """Load schema into the database."""
    with open(SCHEMA_FILE, "r") as schema_file:
        schema_sql = schema_file.read()

    conn = connect_db()
    with conn.cursor() as cursor:
        cursor.execute(schema_sql)
        conn.commit()
    conn.close()
    print("Database schema initialized.")

def main():
    """Check if the database needs to be initialized."""
    if os.path.exists(DATA_PATH):
        print("Data path exists. Checking database...")
    else:
        os.makedirs(DATA_PATH)
        print("Data directory created. Initializing database...")

    initialize_database()
    print("Database is ready.")

if __name__ == "__main__":
    main()
