import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { OrderItem } from '../models/order_item'

@inject(HttpClient)
export class OrderItemService {

  constructor(httpClient) {
    this._http = httpClient
  }

  async addOrderItem (orderItem) {
    const res = await this._http
      .createRequest('/api/orderitems')
      .asPost()
      .withContent(orderItem)
      .withReviver(this._orderItemReviver)
      .send()

    return res.content
  }

  async removeOrderItem (orderItem) {
    const res = await this._http
      .createRequest('/api/orderitems')
      .asDelete()
      .withContent(orderItem)
      .withReviver(this._orderItemReviver)
      .send()

    if (res.content === '') {
      return null
    }
    return res.content
  }

  async getAllForCurrentUserMeal (meal) {
    const res = await this._http
      .createRequest(`/api/meals/${meal.id}/orderitems/user`)
      .asGet()
      .withReviver(this._orderItemReviver)
      .send()

    return res.content
  }

  async getOrderItemsForMeal (meal) {
    const res = await this._http
      .createRequest(`/api/meals/${meal.id}/orderitems`)
      .asGet()
      .withReviver(this._orderItemReviver)
      .send()

    return res.content
  }

  _orderItemReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object' && isNaN(key)) {
      return new OrderItem(value)
    }
    return value
  }
}