from flask import g, jsonify, request
from .app import API_APP
from repositories import MealRepository
from models import Meal


@API_APP.route('/create', methods=['POST'])
def create_meal():
    meal = Meal.from_viewmodel(**request.json)
    repo = MealRepository(g.db)
    meal = repo.insert(meal)
    return jsonify(meal.to_viewmodel())


@API_APP.route('/meals', methods=['GET'])
def get_all_meals():
    repo = MealRepository(g.db)
    meals = repo.get_all()
    return jsonify([x.to_viewmodel() for x in meals])
