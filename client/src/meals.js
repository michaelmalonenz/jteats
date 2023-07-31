import { DialogService } from 'aurelia-dialog'
import { inject } from 'aurelia-framework'
import { MealEditor } from './dialogs/meal-editor'

@inject(DialogService)
export class Meals {
 
  constructor (dialogService) {
    this.dialogService = dialogService
  }

  createMeal() {
    this.dialogService.open({
      viewModel: MealEditor,
      model: {},
      lock: true
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
      }
    })
  }
}