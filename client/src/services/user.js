import { HttpClient } from 'aurelia-http-client'
import { inject } from 'aurelia-framework'
import { User } from '../models/user'
import { UserSettings } from '../models/user_settings'

@inject(HttpClient)
export class UserService {

  constructor(http) {
    this._http = http
  }

  async getAll() {
    const res = await this._http
      .createRequest('/api/users')
      .asGet()
      .withReviver(this._userReviver)
      .send()

    return res.content
  }

  async me () {
    const res = await this._http
      .createRequest('/api/me')
      .asGet()
      .withReviver(this._userReviver)
      .send()

    return res.content
  }

  async getUsersWithOrdersForMeal (mealId) {
    const res = await this._http
      .createRequest(`/api/users/meals/${mealId}`)
      .asGet()
      .withReviver(this._userReviver)
      .send()

    return res.content
  }

  async getCurrentUserSettings () {
    const res = await this._http
      .createRequest('/api/user/settings')
      .asGet()
      .withReviver(this._settingsReviver)
      .send()

    return res.content
  }

  async saveUserSettings (settings) {
    const res = await this._http
      .createRequest('/api/user/settings')
      .asPut()
      .withContent(settings)
      .withReviver(this._settingsReviver)
      .send()

    return res.content
  }

  _userReviver (key, value) {
    if (key === '' && value != null && typeof value === 'object' && isNaN(key)) {
      return new User(value)
    }
    return value
  }

  _settingsReviver (key, value) {
    if (key === '' && value != null && typeof value === 'object' && isNaN(key)) {
      return new UserSettings(value)
    }
    return value
  }
}
