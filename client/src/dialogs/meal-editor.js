import { DialogController } from 'aurelia-dialog'
import { inject } from 'aurelia-framework'
import moment from 'moment'
import { Meal } from '../models/meal'
import { UserService } from '../services/user'
import { UserDisplay } from '../resources/user-display'

@inject(DialogController, UserService)
export class MealEditor {

  heading = 'Create Meal'

  constructor (dialogController, userService) {
    this.controller = dialogController
    this.userService = userService
    this.date = moment()
    this.max = moment().add(4, 'weeks')
    this.description = ''
    this.users = []
    this.owner = {}
  }

  async activate () {
    const users = await this.userService.getAll()
    this.users = users.map(user => {
      return new UserDisplay(user)
    })
  }
  
  save () {
    this.controller.ok(new Meal({
      date: this.date.format('YYYY-MM-DD'),
      description: this.description,
      ownerId: this.owner.id
    }))
  }

  close () {
    this.controller.cancel()
  }
}