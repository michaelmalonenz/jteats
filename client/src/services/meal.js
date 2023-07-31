import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { Meal } from '../models/meal'

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

  _mealReviver(key, value) {
    if (key === '' && value != null && typeof value === 'object') {
      return new Meal(value)
    }
    return value
  }
}
