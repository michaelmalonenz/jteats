import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { Menu } from '../models/menu'

@inject(DialogController)
export class MenuEditor {

  constructor(dialogController) {
    this.controller = dialogController
    this.restaurant = ''
    this.description = ''
  }

  close() {
    this.controller.cancel()
  }

  save() {
    this.controller.ok(new Menu({
      restaurant: this.restaurant,
      description: this.description,
    }))
  }
}