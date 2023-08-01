import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { Menu } from '../models/menu'

@inject(DialogController)
export class MenuEditor {

  constructor(dialogController) {
    this.controller = dialogController
    this.id = null
    this.restaurant = ''
    this.description = ''
  }

  activate (model) {
    if (!!model) {
      Object.assign(this, model)
    }
  }

  close() {
    this.controller.cancel()
  }

  save() {
    this.controller.ok(new Menu({
      id: this.id,
      restaurant: this.restaurant,
      description: this.description,
    }))
  }

}