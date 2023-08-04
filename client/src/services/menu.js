import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { Menu } from '../models/menu'
import { MenuSection } from '../models/menu_section'
import { MenuItem } from '../models/menu_item'

@inject(HttpClient)
export class MenuService {

  constructor(http) {
    this._http = http
  }

  async create (menu) {
    const res = await this._http
      .createRequest('/api/menus')
      .asPost()
      .withContent(menu)
      .withReviver(this._menuReviver)
      .send()

    return res.content
  }

  async getAll () {
    const res = await this._http
        .createRequest('/api/menus')
        .asGet()
        .withReviver(this._menuReviver)
        .send()

    return res.content
  }

  async update (menu) {
    const res = await this._http
      .createRequest(`/api/menus/${menu.id}`)
      .asPut()
      .withContent(menu)
      .withReviver(this._menuReviver)
      .send()

    return res.content
  }

  _menuReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object' && !isNaN(key)) {
      if (key === 'menuItems') return value
      if (key === 'menuSections') return value
      return new Menu(value)
    }
    return value
  }
}