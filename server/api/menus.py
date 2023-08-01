from flask import g, jsonify, request
from .app import API_APP
from repositories import MenuRepository
from models import Menu


@API_APP.route('/menus', methods=['GET', 'POST'])
def menus_api():
    repo = MenuRepository(g.db_session)
    if request.method == 'POST':
        menu = Menu.from_viewmodel(**request.json)
        menu = repo.insert(menu)
        return jsonify(menu.to_viewmodel())
    elif request.method == 'GET':
        return jsonify([menu.to_viewmodel() for menu in repo.get_all()])
