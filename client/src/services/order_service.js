import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { Order } from '../models/order'
import { OrderItem } from '../models/order_item'
import { MenuItem } from '../models/menu_item'

@inject(HttpClient)
export class OrderService {
    constructor (httpClient) {
      this._http = httpClient
    }

    async getOrderForMeal (meal) {
      const res = await this._http
        .createRequest(`/api/meals/${meal.id}/order/user`)
        .asGet()
        .withReviver(this._orderReviver)
        .send()
      return res.content
    }

    _orderReviver (key, value) {
      if (key !== '' && value != null && typeof value === 'object' && isNaN(key)) {
        if (key === 'orderItems') {
          const result = []
          for (let val of value) {
            result.push(new OrderItem(val))
          }
          return result
        }
        else if (key === 'menuItem') {
          return new MenuItem(value)
        }
      }
      return value
    }
}
