import { DialogService } from 'aurelia-dialog'
import { inject } from 'aurelia-framework'
import { MealEditor } from './dialogs/meal-editor'
import { MealService } from './services/meal'

@inject(DialogService, MealService)
export class Meals {
 
  constructor (dialogService, mealService) {
    this.dialogService = dialogService
    this.mealService = mealService
  }

  createMeal() {
    this.dialogService.open({
      viewModel: MealEditor,
      model: {},
      lock: true
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        this.mealService.create(response.output)
      }
    })
  }
}