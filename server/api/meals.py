from flask import g, jsonify, request
from .app import API_APP
from repositories import MealRepository
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
