import { inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { MenuSection } from '../models/menu_section'
import { MenuItem } from '../models/menu_item'

@inject(HttpClient)
export class MenuSectionService {

  constructor (httpClient) {
    this._http = httpClient
  }

  async create (menuSection) {
    const res = await this._http
      .createRequest(`/api/menus/${menuSection.menuId}/sections`)
      .asPost()
      .withContent(menuSection)
      .withReviver(this._menuSectionReviver)
      .send()

    return res.content
  }

  async update (menuSection) {
    const res = await this._http
      .createRequest(`/api/menus/${menuSection.menuId}/sections`)
      .asPut()
      .withContent(menuSection)
      .withReviver(this._menuSectionReviver)
      .send()

    return res.content
  }

  async delete (menuSection) {
    const res = await this._http
      .createRequest(`/api/menus/${menuSection.menuId}/sections/${menuSection.id}`)
      .asDelete()
      .send()

    return res.content
  }

  _menuSectionReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object' && !isNaN(key)) {
      if (key === 'menuItem') {
        return new MenuItem(value)
      }
      return new MenuSection(value)
    }
    return value
  }
}