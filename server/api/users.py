from flask import g, jsonify
from .app import API_APP
from repositories import UserRepository


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
