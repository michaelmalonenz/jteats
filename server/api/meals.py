from flask import g, jsonify, request
from .app import API_APP
from repositories import MealRepository, OrderItemRepository, UserRepository
from models import Meal, OrderItem
from utility import send_close_meal_emails


@API_APP.route('/meals', methods=['POST', 'GET'])
def meals_api():
    repo = MealRepository(g.db_session)
    if request.method == 'POST':
        meal = Meal.from_viewmodel(**request.json)
        meal = repo.insert(meal)
        return jsonify(meal.to_viewmodel())
    elif request.method == 'GET':
        meals = repo.get_all()
        return jsonify([x.to_viewmodel() for x in meals])


@API_APP.route('/meals/<int:meal_id>', methods=['PUT', 'DELETE'])
def update_meal(meal_id):
    repo = MealRepository(g.db_session)
    if request.method == 'PUT':
        meal = Meal.from_viewmodel(**request.json)
        meal = repo.update(meal)
        return jsonify(meal.to_viewmodel())
    elif request.method == 'DELETE':
        repo.delete(meal_id)
        return ('', 200)


@API_APP.route('/meals/<int:meal_id>/orderitems/user', methods=['GET'])
def meal_user_order_items(meal_id):
    repo = OrderItemRepository(g.db_session)
    items = repo.get_user_items_for_meal(meal_id, g.current_user_id)
    return jsonify([x.to_viewmodel() for x in items])


@API_APP.route('/meals/<int:meal_id>/orderitems', methods=['GET', 'PUT'])
def meal_order_items(meal_id):
    repo = OrderItemRepository(g.db_session)
    if request.method == 'GET':
        items = repo.get_order_items_for_meal(meal_id)
        return jsonify([x.to_viewmodel() for x in items])
    else:
        repo.update_many([OrderItem.from_viewmodel(**x) for x in request.json])
        return ('', 200)


@API_APP.route('/meals/<int:meal_id>/closeorders', methods=['POST'])
def meal_close_orders(meal_id):
    repo = MealRepository(g.db_session)
    meal = repo.close_orders(meal_id)
    user_repo = UserRepository(g.db_session)
    settings = user_repo.get_user_settings(meal.owner.id)
    send_close_meal_emails(meal, settings)
    g.socketio.emit('meal_closed', {'mealId': meal.id}, broadcast=True)
    return jsonify(meal.to_viewmodel())

@API_APP.route('/meals/<int:meal_id>/reopenorders', methods=['POST'])
def meal_reopen_orders(meal_id):
    repo = MealRepository(g.db_session)
    meal = repo.reopen_orders(meal_id)
    g.socketio.emit('meal_reopened', {'mealId': meal.id}, broadcast=True)
    return jsonify(meal.to_viewmodel())
