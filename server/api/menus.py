from flask import g, jsonify, request
from .app import API_APP
from repositories import MenuRepository
from models import Menu


@API_APP.route('/create')
def create_meal():
    menu = Menu.from_viewmodel(**request.json)
    repo = MenuRepository(g.db_session)
    menu = repo.insert(menu)
    return jsonify(menu.to_viewmodel())
