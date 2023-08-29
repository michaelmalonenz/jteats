import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { ItemOption } from '../models/item_option'

@inject(HttpClient)
export class ItemOptionService {

    constructor (httpClient) {
        this._http = httpClient
    }

    async create (option) {
        const res = await this._http
            .createRequest(`/api/menuitems/${option.menuItemId}/options`)
            .asPut()
            .withContent(option)
            .withReviver(this._itemOptionReviver)
            .send()

        return res.content
    } 

    _itemOptionReviver (key, value) {
        if (key !== '' && value != null && typeof value === 'object' && isNaN(key)) {
            return new ItemOption(value)
        }
        return value
    }
}