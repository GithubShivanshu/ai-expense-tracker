import traceback
from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .extensions import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)
    db.init_app(app)

    # Register blueprints
    from .api import api_bp
    app.register_blueprint(api_bp, url_prefix='/')

    # Global error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad Request", "message": error.description if hasattr(error, 'description') else str(error)}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not Found", "message": "The requested resource was not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        # We also might want to log this properly in a real app
        print("Internal Server Error:", error)
        traceback.print_exc()
        return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred"}), 500

    return app
