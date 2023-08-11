import { inject, DOM, NewInstance } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { Menu } from '../models/menu'
import { ValidationController, ValidationRules } from 'aurelia-validation'
import { MenuService } from '../services/menu'

@inject(DialogController, NewInstance.of(ValidationController), MenuService, DOM.Element)
export class MenuEditor {

  constructor (dialogController, validationController, menuService, element) {
    this.controller = dialogController
    this.validationController = validationController
    this.menuService = menuService
    this.element = element
    this.id = null
    this.restaurant = ''
    this.description = ''
    this.header = 'Create Menu'

    this.boundKeyDown = this.keydown.bind(this)
  }

  activate (model) {
    if (!!model) {
      this.header = 'Edit Menu'
      Object.assign(this, model)
    }
  }

  close () {
    this.controller.cancel()
  }

  async save () {
    const result = await this.validationController.validate()
    if (result.valid) {
      this.controller.ok(new Menu({
        id: this.id,
        restaurant: this.restaurant,
        description: this.description,
      }))
    }
  }

  async deleteMenu () {
    await this.menuService.delete(this.id)
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

ValidationRules
  .ensure('restaurant').displayName('Restaurant Name').required()
  .on(MenuEditor)
