from flask import request, jsonify
from datetime import datetime
from . import api_bp
from ..models import Expense
from ..extensions import db
from sqlalchemy import func

@api_bp.route('/expenses', methods=['POST'])
def create_expense():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Bad Request", "message": "No JSON payload provided"}), 400
    
    title = data.get('title')
    amount = data.get('amount')
    category = data.get('category', 'Uncategorized')
    date_str = data.get('date')

    if not title or amount is None:
        return jsonify({"error": "Bad Request", "message": "Title and amount are required"}), 400

    try:
        amount = float(amount)
    except ValueError:
        return jsonify({"error": "Bad Request", "message": "Amount must be a number"}), 400

    expense_date = datetime.utcnow().date()
    if date_str:
        try:
            expense_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Bad Request", "message": "Date must be in YYYY-MM-DD format"}), 400

    expense = Expense(title=title, amount=amount, category=category, date=expense_date)
    db.session.add(expense)
    db.session.commit()

    return jsonify(expense.to_dict()), 201

@api_bp.route('/expenses', methods=['GET'])
def list_expenses():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    category = request.args.get('category')
    limit = request.args.get('limit', 50, type=int)
    offset = request.args.get('offset', 0, type=int)

    query = Expense.query

    if start_date:
        try:
            sd = datetime.strptime(start_date, "%Y-%m-%d").date()
            query = query.filter(Expense.date >= sd)
        except ValueError:
            pass

    if end_date:
        try:
            ed = datetime.strptime(end_date, "%Y-%m-%d").date()
            query = query.filter(Expense.date <= ed)
        except ValueError:
            pass
            
    if category:
        query = query.filter(Expense.category.ilike(f"%{category}%"))

    # Order by date descending, then id descending
    expenses = query.order_by(Expense.date.desc(), Expense.id.desc()).limit(limit).offset(offset).all()
    
    return jsonify([exp.to_dict() for exp in expenses]), 200

@api_bp.route('/summary', methods=['GET'])
def get_summary():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    query = db.session.query(Expense.category, func.sum(Expense.amount).label('total'))

    if start_date:
        try:
            sd = datetime.strptime(start_date, "%Y-%m-%d").date()
            query = query.filter(Expense.date >= sd)
        except ValueError:
            pass

    if end_date:
        try:
            ed = datetime.strptime(end_date, "%Y-%m-%d").date()
            query = query.filter(Expense.date <= ed)
        except ValueError:
            pass

    breakdown = query.group_by(Expense.category).all()
    
    total_amount = sum(row.total for row in breakdown if row.total)
    category_breakdown = {row.category: float(row.total) for row in breakdown if row.total}

    return jsonify({
        "total": float(total_amount),
        "breakdown": category_breakdown
    }), 200
