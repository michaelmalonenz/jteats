from .app import API_APP
from models import ItemOption
from repositories import ItemOptionRepository
from flask import g, request, jsonify


@API_APP.route('/menuitems/<int:menu_item_id>/option', methods=['POST'])
def create_item_option(menu_item_id):
    option = ItemOption.from_viewmodel(**request.json())
    repo = ItemOptionRepository(g.db_session)
    result = repo.insert(option)
    return jsonify(result.to_viewmodel())
