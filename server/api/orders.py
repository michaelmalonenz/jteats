from flask import g, jsonify, request
from .app import API_APP
from repositories import OrderRepository
from models import Order


@API_APP.route('/orders/<int:order_id>/items/<int:item_id>', methods=['DELETE'])
def remove_item_from_order(order_id, item_id):
    repo = OrderRepository(g.db_session)
    item = repo.remove_order_item(order_id, item_id)
    if item is not None:
        return jsonify(item.to_viewmodel())
    return ('', 200)


@API_APP.route('/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    repo = OrderRepository(g.db_session)
    order = Order.from_viewmodel(**request.json)
    repo.update_order(order)
    return ('', 200)
