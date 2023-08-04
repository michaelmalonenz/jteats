from flask import g, jsonify, request
from .app import API_APP
from repositories import MealRepository, OrderItemRepository
from models import Meal


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


@API_APP.route('/meals/<int:meal_id>/orderitems', methods=['GET'])
def meal_order_items(meal_id):
    repo = OrderItemRepository(g.db_session)
    items = repo.get_user_items_for_meal(meal_id, g.current_user_id)
    return jsonify([x.to_viewmodel() for x in items])
