import { DialogService } from 'aurelia-dialog'
import { inject, computedFrom } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { MealEditor } from './dialogs/meal-editor'
import { MealService } from './services/meal'
import { OrderItemService } from './services/order_item_service'
import { AuthorizeStep } from './security/authorise'
import { ORDER_ADDED } from './utils/events'

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
    this.allOrderItems = []
  }

  async activate () {
    this.meals = await this.mealService.getAll()
    if (this.meals?.length) {
      await this.selectMeal(this.meals[0])
    }
  }

  bind () {
    this.orderItemAddedSub = this.eventAggregator.subscribe(ORDER_ADDED, this.orderAdded.bind(this))
  }

  unbind () {
    this.orderItemAddedSub.dispose()
  }

  @computedFrom('selectedMeal')
  get mealOwner () {
    return this.selectedMeal.ownerId === AuthorizeStep.user.id
  }

  @computedFrom('allOrderItems')
  get totalCost () {
    return this.allOrderItems.reduce((accumulator, orderItem) => {
      return accumulator + (orderItem.quantity * orderItem.menuItem.price)
    }, 0)
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
    if (meal.closed) {
      this.allOrderItems = await this.orderItemService.getOrderItemsForMeal(meal)
    } else {
      this.myOrderItems = await this.orderItemService.getAllForCurrentUserMeal(meal)
    }
  }

  async closeOrders () {
    this.selectedMeal = await this.mealService.closeOrders(this.selectedMeal)
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

  orderAdded (item) {
    const index = this.myOrderItems.findIndex(x => x.id == item.id)
    if (index === -1) {
      this.myOrderItems.push(item)
    } else {
      Object.assign(this.myOrderItems[index], item)
    }
  }
}