import { inject, DOM } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { Menu } from '../models/menu'

@inject(DialogController, DOM.Element)
export class MenuEditor {

  constructor(dialogController, element) {
    this.controller = dialogController
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