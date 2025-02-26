# Use a Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install sqlite3 and other dependencies
RUN apt-get update && \
    apt-get install -y sqlite3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the database manager script
COPY main.py /app/
RUN chmod +x /app/main.py

# Create a directory for the database
RUN mkdir -p /data

# Set environment variables
ENV DB_PATH=/data/edge_devices.db
ENV PYTHONUNBUFFERED=1

# Volume for persistent storage
VOLUME ["/data"]

# Run the database manager script when the container starts
CMD ["python", "/app/main.py"]