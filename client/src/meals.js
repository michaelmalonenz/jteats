import { DialogService } from 'aurelia-dialog'
import { inject, computedFrom } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { MealEditor } from './dialogs/meal-editor'
import { MealService } from './services/meal'
import { OrderItemService } from './services/order_item_service'
import { AuthorizeStep } from './security/authorise'

@inject(DialogService, EventAggregator, MealService, OrderItemService)
export class Meals {
 
  constructor (dialogService, eventAggregator, mealService, orderItemService) {
    this.dialogService = dialogService
    this.eventAggregator = eventAggregator
    this.mealService = mealService
    this.orderItemService = orderItemService
    this.meals = []
    this.selectedMeal = null
    this.myOrderItems = []
  }

  async activate () {
    this.meals = await this.mealService.getAll()
    if (this.meals?.length) {
      await this.selectMeal(this.meals[0])
    }
  }

  @computedFrom('selectedMeal')
  get mealOwner () {
    return this.selectedMeal.ownerId === AuthorizeStep.user.id
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
        this.selectedMeal = meal
      }
    })
  }

  async selectMeal (meal) {
    this.selectedMeal = meal
    this.myOrderItems = await this.orderItemService.getAllForCurrentUserMeal(meal)
  }

  async closeOrders () {

  }

  async removeItem (item) {
    const result = await this.orderItemService.removeOrderItem(item)
    if (result == null) {
      const index = this.myOrderItems.indexOf(item)
      this.myOrderItems.splice(index, 1)
    } else {
      Object.assign(item, result)
    }
  }
}