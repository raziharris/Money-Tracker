from flask import Blueprint, request, jsonify
from models import db, Category, Transaction, Budget
from datetime import datetime

bp = Blueprint('api', __name__, url_prefix='/api')

# ==================== Categories ====================
@bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories])


@bp.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400

    category = Category(name=data['name'])
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201


@bp.route('/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return '', 204


# ==================== Transactions ====================
@bp.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([t.to_dict() for t in transactions])


@bp.route('/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['amount', 'category_id', 'description', 'type', 'date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        transaction = Transaction(
            amount=float(data['amount']),
            category_id=int(data['category_id']),
            description=data['description'],
            type=data['type'],
            date=datetime.fromisoformat(data['date']).date()
        )
        db.session.add(transaction)
        db.session.commit()
        return jsonify(transaction.to_dict()), 201
    except (ValueError, KeyError) as e:
        return jsonify({'error': str(e)}), 400


@bp.route('/transactions/<int:id>', methods=['GET'])
def get_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    return jsonify(transaction.to_dict())


@bp.route('/transactions/<int:id>', methods=['PUT'])
def update_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    data = request.get_json()

    try:
        if 'amount' in data:
            transaction.amount = float(data['amount'])
        if 'category_id' in data:
            transaction.category_id = int(data['category_id'])
        if 'description' in data:
            transaction.description = data['description']
        if 'type' in data:
            transaction.type = data['type']
        if 'date' in data:
            transaction.date = datetime.fromisoformat(data['date']).date()

        db.session.commit()
        return jsonify(transaction.to_dict())
    except (ValueError, KeyError) as e:
        return jsonify({'error': str(e)}), 400


@bp.route('/transactions/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    db.session.delete(transaction)
    db.session.commit()
    return '', 204


# ==================== Budgets ====================
@bp.route('/budgets', methods=['GET'])
def get_budgets():
    budgets = Budget.query.all()
    return jsonify([b.to_dict() for b in budgets])


@bp.route('/budgets', methods=['POST'])
def create_budget():
    data = request.get_json()

    # Validate required fields
    required_fields = ['category_id', 'limit', 'month']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        budget = Budget(
            category_id=int(data['category_id']),
            limit=float(data['limit']),
            month=data['month']
        )
        db.session.add(budget)
        db.session.commit()
        return jsonify(budget.to_dict()), 201
    except (ValueError, KeyError) as e:
        return jsonify({'error': str(e)}), 400


@bp.route('/budgets/<int:id>', methods=['DELETE'])
def delete_budget(id):
    budget = Budget.query.get_or_404(id)
    db.session.delete(budget)
    db.session.commit()
    return '', 204


# ==================== Health Check ====================
@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200
