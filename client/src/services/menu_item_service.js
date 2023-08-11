import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { MenuItem } from '../models/menu_item'

@inject(HttpClient)
export class MenuItemService {
  constructor(httpClient) {
    this._http = httpClient
  }

  async create(menuItem) {
    const res = await this._http
      .createRequest(`/api/menus/${menuItem.menuId}/sections/${menuItem.menuSectionId}/items`)
      .asPost()
      .withContent(menuItem)
      .withReviver(this._menuItemReviver)
      .send()

    return res.content
  }

  async update (menuItem) {
    const res = await this._http
      .createRequest(`/api/menus/${menuItem.menuId}/sections/${menuItem.menuSectionId}/items`)
      .asPut()
      .withContent(menuItem)
      .withReviver(this._menuItemReviver)
      .send()

    return res.content
  }

  async delete (menuId, menuSectionId, menuItemId) {
    const res = await this._http
      .createRequest(`/api/menus/${menuId}/sections/${menuSectionId}/items/${menuItemId}`)
      .asDelete()
      .send()

    return res.content
  }

  _menuItemReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object' && !isNaN(key)) {
      return new MenuItem(value)
    }
    return value
  }
}
