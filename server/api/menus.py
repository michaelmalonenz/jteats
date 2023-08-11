from flask import g, jsonify, request
from .app import API_APP
from repositories import MenuRepository, MenuSectionRepository, MenuItemRepository
from models import Menu, MenuSection, MenuItem


@API_APP.route('/menus', methods=['GET', 'POST'])
def menus_api():
    repo = MenuRepository(g.db_session)
    if request.method == 'POST':
        menu = Menu.from_viewmodel(**request.json)
        menu = repo.insert(menu)
        return jsonify(menu.to_viewmodel())
    elif request.method == 'GET':
        return jsonify([menu.to_viewmodel() for menu in repo.get_all()])


@API_APP.route('/menus/<int:menu_id>', methods=['PUT', 'GET'])
def update_menu(menu_id):
    repo = MenuRepository(g.db_session)
    if request.method == 'GET':
        menu = repo.get_by_id(menu_id)
    elif request.method == 'PUT':
        menu = Menu.from_viewmodel(**request.json)
        menu = repo.update(menu)
    return jsonify(menu.to_viewmodel())


@API_APP.route('/menus/<int:menu_id>/sections', methods=['POST', 'PUT'])
def menu_section_api(menu_id):
    repo = MenuSectionRepository(g.db_session)
    section = MenuSection.from_viewmodel(**request.json)
    if request.method == 'POST':
        section = repo.insert(section)
    elif request.method == 'PUT':
        section = repo.update(section)
    return jsonify(section.to_viewmodel())


@API_APP.route('/menus/<int:menu_id>/sections/<int:menu_section_id>/items', methods=['POST', 'PUT'])
def menu_item_api(menu_id, menu_section_id):
    repo = MenuItemRepository(g.db_session)
    item = MenuItem.from_viewmodel(**request.json)
    if request.method == 'POST':
        item = repo.insert(item)
    elif request.method == 'PUT':
        item = repo.update(item)
    return jsonify(item.to_viewmodel())


@API_APP.route('/menus/<int:menu_id>', methods=['DELETE'])
def delete_menu(menu_id):
    repo = MenuRepository(g.db_session)
    repo.delete(menu_id)
    return ('', 200)


@API_APP.route('/menus/<int:menu_id>/sections/<int:section_id>', methods=['DELETE'])
def delete_menu_section(menu_id, section_id):
    repo = MenuSectionRepository(g.db_session)
    repo.delete(section_id)
    return ('', 200)


@API_APP.route('/menus/<int:menu_id>/sections/<int:section_id>/items/<int:item_id>', methods=['DELETE'])
def delete_menu_item(menu_id, section_id, item_id):
    repo = MenuItemRepository(g.db_session)
    repo.delete(item_id)
    return ('', 200)
