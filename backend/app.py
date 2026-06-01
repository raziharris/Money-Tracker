import os
from flask import Flask
from flask_cors import CORS
from models import db, Category, Budget, Transaction

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///money_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database with app
db.init_app(app)

# Enable CORS
CORS(app)

# Import routes
from routes import api

# Register blueprints
app.register_blueprint(api.bp)

# Create tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
