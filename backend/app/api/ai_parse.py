from flask import request, jsonify
from . import api_bp
from ..services.openai_service import parse_expense_text
import logging

logger = logging.getLogger(__name__)

@api_bp.route('/ai-parse', methods=['POST'])
def ai_parse_expense():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Bad Request", "message": "Missing 'text' in JSON payload"}), 400

    text = data.get('text')
    if not text.strip():
        return jsonify({"error": "Bad Request", "message": "Text cannot be empty"}), 400

    try:
        parsed_data = parse_expense_text(text)
        return jsonify(parsed_data), 200
    except Exception as e:
        logger.error(f"Error parsing expense text: {e}")
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500
