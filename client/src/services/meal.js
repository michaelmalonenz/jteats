import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { Meal } from '../models/meal'
import { OrderItem } from '../models/order_item'
import moment from 'moment'

@inject(HttpClient)
export class MealService {

  constructor(http) {
    this._http = http
  }

  async create(meal) {
    const res = await this._http
      .createRequest('/api/meals')
      .asPost()
      .withContent(meal)
      .withReviver(this._mealReviver)
      .send()

    return res.content
  }

  async getAll() {
    const res = await this._http
      .createRequest('/api/meals')
      .asGet()
      .withReviver(this._mealReviver)
      .send()

    return res.content
  }

  _mealReviver(key, value) {
    if (key !== '' && value != null && typeof value === 'object' && !isNaN(key)) {
      if (key === 'orderItem') {
        return new OrderItem(value)
      }
      return new Meal(value)
    }
    if (key === 'date') {
      return moment(value)
    }
    return value
  }
}
