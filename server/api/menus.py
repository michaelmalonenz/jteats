from flask import g, jsonify, request
from .app import API_APP
from repositories import MenuRepository, MenuSectionRepository
from models import Menu, MenuSection


@API_APP.route('/menus', methods=['GET', 'POST'])
def menus_api():
    repo = MenuRepository(g.db_session)
    if request.method == 'POST':
        menu = Menu.from_viewmodel(**request.json)
        menu = repo.insert(menu)
        return jsonify(menu.to_viewmodel())
    elif request.method == 'GET':
        return jsonify([menu.to_viewmodel() for menu in repo.get_all()])


@API_APP.route('/menus/<int:menu_id>', methods=['PUT'])
def update_menu(menu_id):
    repo = MenuRepository(g.db_session)
    menu = Menu.from_viewmodel(**request.json)
    menu = repo.update(menu)
    return jsonify(menu.to_viewmodel())


@API_APP.route('/menus/<int:menu_id>/sections', methods=['POST', 'PUT'])
def add_menu_section(menu_id):
    repo = MenuSectionRepository(g.db_session)
    section = MenuSection.from_viewmodel(**request.json)
    if request.method == 'POST':
        section = repo.insert(section)
    elif request.method == 'PUT':
        section = repo.update(section)
    return jsonify(section.to_viewmodel())
