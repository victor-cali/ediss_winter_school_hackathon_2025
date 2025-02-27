# routes.py - Web application routes
from flask import render_template_string
from models import Message

def register_routes(app):
    """Register routes with the Flask application.
    
    Args:
        app: The Flask application instance
    """
    @app.route("/")
    def home():
        """Home page route that displays recent messages."""
        messages = Message.get_messages(limit=10)
        
        # Simple HTML template for displaying messages
        template = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Flask MQTT Monitor</title>
            <meta http-equiv="refresh" content="10"> <!-- Auto-refresh every 10 seconds -->
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                .message { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
                .message:hover { background-color: #f9f9f9; }
                .topic { font-weight: bold; color: #555; }
                .payload { background-color: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 3px; white-space: pre-wrap; }
                .timestamp { color: #888; font-size: 0.8em; text-align: right; }
                .no-messages { color: #666; font-style: italic; }
            </style>
        </head>
        <body>
            <h1>MQTT Message Monitor</h1>
            
            {% if messages %}
                {% for message in messages %}
                    <div class="message">
                        <div class="topic">Topic: {{ message.topic }}</div>
                        <div class="payload">{{ message.payload }}</div>
                        <div class="timestamp">{{ message.timestamp.strftime('%Y-%m-%d %H:%M:%S') }}</div>
                    </div>
                {% endfor %}
            {% else %}
                <p class="no-messages">No messages received yet. Waiting for MQTT messages...</p>
            {% endif %}
            
            <p><small>Auto-refreshes every 10 seconds. Last updated: {{ now() }}</small></p>
        </body>
        </html>
        """
        
        # Helper function to get current time
        def now():
            from datetime import datetime
            return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return render_template_string(template, messages=messages, now=now)