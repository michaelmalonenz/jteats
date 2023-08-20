from flask import g, jsonify, request
from .app import API_APP
from repositories import UserRepository
from models import UserSettings


@API_APP.route('/me')
def get_logged_in_user():
    if hasattr(g, 'current_user_id'):
        repo = UserRepository(g.db_session)
        user = repo.get_by_id(g.current_user_id)
        return jsonify(user.to_viewmodel())
    return ('', 404)


@API_APP.route('/users', methods=['GET'])
def get_all_users():
    repo = UserRepository(g.db_session)
    users = repo.get_all()
    return jsonify([user.to_viewmodel() for user in users])


@API_APP.route('/users/meals/<int:meal_id>')
def get_users_for_meal(meal_id):
    repo = UserRepository(g.db_session)
    users = repo.get_users_for_meal(meal_id)
    return jsonify([user.to_viewmodel() for user in users])


@API_APP.route('/user/settings', methods=['GET', 'PUT'])
def get_user_settings():
    repo = UserRepository(g.db_session)
    if request.method == 'GET':
        settings = repo.get_user_settings(g.current_user_id)
        return jsonify(settings.to_viewmodel())
    elif request.method == 'PUT':
        settings = UserSettings.from_viewmodel(**request.json)
        settings = repo.save_user_settings(settings)
        return jsonify(settings.to_viewmodel())
