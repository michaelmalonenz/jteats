import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { Meal } from '../models/meal'
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

  async update (meal) {
    const res = await this._http
      .createRequest(`/api/meals/${meal.id}`)
      .asPut()
      .withContent(meal)
      .withReviver(this._mealReviver)
      .send()

      return res.conent
  }

  async delete (meal_id) {
    await this._http
      .createRequest(`/api/meals/${meal_id}`)
      .asDelete()
      .send()
  }

  async getAll() {
    const res = await this._http
      .createRequest('/api/meals')
      .asGet()
      .withReviver(this._mealReviver)
      .send()

    return res.content
  }

  async closeOrders (meal) {
    const res = await this._http
      .createRequest(`/api/meals/${meal.id}/closeorders`)
      .asPost()
      .withReviver(this._mealReviver)
      .send()

    return res.content
  }

  async reopenOrders (meal) {
    const res = await this._http
      .createRequest(`/api/meals/${meal.id}/reopenorders`)
      .asPost()
      .withReviver(this._mealReviver)
      .send()

    return res.content
  }

  _mealReviver(key, value) {
    if (key !== '' && value != null && typeof value === 'object' && isNaN(key)) {
      return new Meal(value)
    }
    if (key === 'date') {
      return moment(value)
    }
    return value
  }
}
