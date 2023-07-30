from flask import g, jsonify
from .app import API_APP
from repositories import UserRepository


@API_APP.route('/me')
def get_logged_in_user():
    if hasattr(g, 'current_user_id'):
        repo = UserRepository(g.db)
        user = repo.get_by_external_id(g.current_user_id)
        return jsonify(user.to_viewmodel())
    return ('', 404)