import { DialogService } from 'aurelia-dialog'
import { inject } from 'aurelia-framework'
import { MealEditor } from './dialogs/meal-editor'
import { MealService } from './services/meal'

@inject(DialogService, MealService)
export class Meals {
 
  constructor (dialogService, mealService) {
    this.dialogService = dialogService
    this.mealService = mealService
    this.meals = []
  }

  async activate () {
    this.meals = await this.mealService.getAll()
  }

  createMeal() {
    this.dialogService.open({
      viewModel: MealEditor,
      model: {},
      lock: true
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        const meal = await this.mealService.create(response.output)
        this.meals.push(meal)
      }
    })
  }
}