import { DialogController } from 'aurelia-dialog'
import { inject, DOM } from 'aurelia-framework'
import moment from 'moment'
import { Meal } from '../models/meal'
import { UserService } from '../services/user'
import { UserDisplay } from '../resources/user-display'
import { MenuDisplay } from '../resources/menu-display'
import { MenuService } from '../services/menu'
import { MealService } from '../services/meal'
import { AuthorizeStep } from '../security/authorise'

@inject(DialogController, UserService, MenuService, MealService, DOM.Element)
export class MealEditor {

  heading = 'Create Meal'

  constructor (dialogController, userService, menuService, mealService, element) {
    this.controller = dialogController
    this.userService = userService
    this.menuService = menuService
    this.mealService = mealService
    this.element = element
    this.id = null
    this.date = moment()
    this.max = moment().add(4, 'weeks')
    this.description = ''
    this.users = []
    this.owner = null
    this.menus = []
    this.menu = null

    this.boundKeyDown = this.keydown.bind(this)
  }

  async activate (model) {
    const users = await this.userService.getAll()
    this.users = users.map(user => new UserDisplay(user))

    const menus = await this.menuService.getAll()
    this.menus = menus.map(menu => new MenuDisplay(menu))
    this.menu = this.menus[0]

    if (model) {
      this.heading = "Edit Meal"
      this.id = model.id
      this.date = model.date
      this.description = model.description
      this.owner = this.users.find(user => user.id === model.ownerId)
    } else {
      this.owner = this.users.find(user => user.id === AuthorizeStep.user.id)
    }
  }
  
  save () {
    this.controller.ok(new Meal({
      id: this.id,
      date: this.date.format('YYYY-MM-DD'),
      description: this.description,
      ownerId: this.owner.id,
      menuId: this.menu.id,
    }))
  }

  close () {
    this.controller.cancel()
  }

  keydown (event) {
    if (event.key === 'Enter') {
      this.save()
    }
  }

  attached () {
    this.element.addEventListener('keydown', this.boundKeyDown)
  }

  detached () {
    this.element.removeEventListener('keydown', this.boundKeyDown)
  }

  async deleteMeal () {
    await this.mealService.delete(this.id)
    this.controller.cancel()
  }
}