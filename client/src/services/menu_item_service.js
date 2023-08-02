import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'

@inject(HttpClient)
export class MenuItemService {
    constructor (httpClient) {
        this._http = httpClient
    }

    async create (menuItem) {
        const res = await this._http
            .createRequest(`/api/menus/${menuItem.menuId}/sections/${menuItem.menuSectionId}/items`)
    }
}
