import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { Menu } from '../models/menu'

@inject(HttpClient)
export class MealService {

  constructor(http) {
    this._http = http
  }

  async create(menu) {
    const res = await this._http
      .createRequest('/api/menus')
      .asPost()
      .withContent(menu)
      .withReviver(this._menuReviver)
      .send()

    return res.content
  }

  _menuReviver () {
    if (key !== '' && value != null && typeof value === 'object' && !isNaN(key)) {
        return new Menu(value)
    }
    return value
  }
}