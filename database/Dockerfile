# Use the official PostgreSQL image as the base
FROM postgres:latest

# Set environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=edgedevicedb

# Copy the initialization SQL script
COPY schema.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432