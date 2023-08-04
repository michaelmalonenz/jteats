from flask import g, jsonify, request
from .app import API_APP
from repositories import OrderItemRepository
from models import OrderItem


@API_APP.route('/orderitems', methods=['POST', 'GET', 'DELETE'])
def order_items_api():
    repo = OrderItemRepository(g.db_session)
    if request.method == 'POST':
        order_item = OrderItem.from_viewmodel(**request.json)
        order_item = repo.add_order_item(order_item)
        return jsonify(order_item.to_viewmodel())
    elif request.method == 'GET':
        order_items = repo.get_all()
        return jsonify([x.to_viewmodel() for x in order_items])
    elif request.method == 'DELETE':
        order_item = OrderItem.from_viewmodel(**request.json)
        order_item = repo.remove_order_item(order_item)
        if order_item is not None:
            return jsonify(order_item.to_viewmodel())
        return ('', 200)
