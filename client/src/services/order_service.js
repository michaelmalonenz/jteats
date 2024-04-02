import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { Order } from '../models/order'
import { OrderItem } from '../models/order_item'

@inject(HttpClient)
export class OrderItemService {
    constructor (httpClient) {
        this._http = httpClient
    }

    async getCurrentUserMealOrder (meal) {
        const res = await this._http
            .createRequest(`/api/orders/current`)
            .withParams({ mealId: meal.id })
            .asGet()
            .withReviver(this._orderReviver)
            .send()
        return res.content
    }

    _orderReviver (key, value) {
        if (key !== '' && value != null && typeof value === 'object' && isNaN(key)) {
          if (key === 'orderItem') {
            return new OrderItem(value)
          }
          return new Order(value)
        }
        return value
      }
}
