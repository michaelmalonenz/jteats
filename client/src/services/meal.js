import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { Meal } from '../models/meal'
import { MenuItem } from '../models/menu_item'
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
    if (key !== '' && value != null && typeof value === 'object' && isNaN(key)) {
      if (key === 'orderItems') return value
      if (key === 'menuItems') return value
      if (key === 'menuSections') return value
      if (key === 'menuItem') return new MenuItem(value)
      return new Meal(value)
    }
    if (key === 'date') {
      return moment(value)
    }
    return value
  }
}
