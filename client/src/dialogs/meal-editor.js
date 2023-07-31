import { DialogController } from 'aurelia-dialog'
import { inject } from 'aurelia-framework'

@inject(DialogController)
export class MealEditor {

  heading = 'Meal Editor'

  constructor (dialogController) {
    this.controller = dialogController
  }
  
  save () {
    this.controller.ok()
  }

  close () {
    this.controller.cancel()
  }
}