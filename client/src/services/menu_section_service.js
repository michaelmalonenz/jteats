import { inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { MenuSection } from '../models/menu_section'

@inject(HttpClient)
export class MenuSectionService {

  constructor(httpClient) {
    this._http = httpClient
  }

  async create(menuSection) {
    const res = await this._http
      .createRequest(`/api/menus/${menuSection.menuId}/sections`)
      .asPost()
      .withContent(menuSection)
      .withReviver(this._menuSectionReviver)
      .send()

    return res.content
  }

  _menuSectionReviver(key, value) {
    if (key !== '' && value != null && typeof value === 'object' && !isNaN(key)) {
      return new MenuSection(value)
    }
    return value
  }
}