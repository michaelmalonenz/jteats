import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'

@inject(HttpClient)
export class OrderItemService {

  constructor(httpClient) {
    this._http = httpClient
  }

  async create(orderItem) {
    const res = this._http
      .createRequest('/api/orderitems')
      .asPost()
      .withContent(orderItem)
      .withReviver(this._orderItemReviver)
      .send()

    return res.content
  }
}