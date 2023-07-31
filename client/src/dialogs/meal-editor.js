import { DialogController } from 'aurelia-dialog'
import { inject } from 'aurelia-framework'
import moment from 'moment'
import { Meal } from '../models/meal'

@inject(DialogController)
export class MealEditor {

  heading = 'Meal Editor'

  constructor (dialogController) {
    this.controller = dialogController
    this.date = moment()
    this.max = moment().add(4, 'weeks')
    this.description = ''
  }
  
  save () {
    this.controller.ok(new Meal({
      date: this.date.format('YYYY-MM-DD'),
      description: this.description,
    }))
  }

  close () {
    this.controller.cancel()
  }
}