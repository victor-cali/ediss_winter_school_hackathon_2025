# app.py - Main application file
from flask import Flask
from flask_mqtt_helper import setup_mqtt
from database import init_db, db_session, wait_for_postgres
from models import Message
from routes import register_routes
import config
import time

def create_app():
    """Create and configure the Flask application."""
    # Initialize Flask app
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config)
    
    # Ensure PostgreSQL is available
    if not wait_for_postgres():
        raise RuntimeError("Could not connect to PostgreSQL database")
    
    # Initialize database
    init_db()
    
    # Register teardown context
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        """Close the database session at the end of the request."""
        db_session.remove()
    
    # Setup MQTT client
    setup_mqtt(app)
    
    # Register routes
    register_routes(app)
    
    return app

# Run the application
if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', debug=True)