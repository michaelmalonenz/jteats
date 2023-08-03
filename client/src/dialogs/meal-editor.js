import { DialogController } from 'aurelia-dialog'
import { inject, DOM } from 'aurelia-framework'
import moment from 'moment'
import { Meal } from '../models/meal'
import { UserService } from '../services/user'
import { UserDisplay } from '../resources/user-display'
import { MenuDisplay } from '../resources/menu-display'
import { MenuService } from '../services/menu'
import { AuthorizeStep } from '../security/authorise'

@inject(DialogController, UserService, MenuService, DOM.Element)
export class MealEditor {

  heading = 'Create Meal'

  constructor (dialogController, userService, menuService, element) {
    this.controller = dialogController
    this.userService = userService
    this.menuService = menuService
    this.element = element
    this.date = moment()
    this.max = moment().add(4, 'weeks')
    this.description = ''
    this.users = []
    this.owner = null
    this.menus = []
    this.menu = null

    this.boundKeyDown = this.keydown.bind(this)
  }

  async activate () {
    const users = await this.userService.getAll()
    this.users = users.map(user => new UserDisplay(user))
    this.user = this.users.find(user => user.id === AuthorizeStep.user?.id)

    const menus = await this.menuService.getAll()
    this.menus = menus.map(menu => new MenuDisplay(menu))
    this.menu = this.menus[0]
  }
  
  save () {
    this.controller.ok(new Meal({
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
}