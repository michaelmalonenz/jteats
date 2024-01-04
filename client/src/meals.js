import { DialogService } from 'aurelia-dialog'
import { inject, computedFrom } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { EventAggregator } from 'aurelia-event-aggregator'
import { MealEditor } from './dialogs/meal-editor'
import { MealService } from './services/meal'
import { MenuService } from './services/menu'
import { OrderItemService } from './services/order_item_service'
import { UserService } from './services/user'
import { AuthorizeStep } from './security/authorise'
import { OrderItem } from './models/order_item'
import { ORDER_ADDED, ITEM_ORDERED, MEAL_CLOSED } from './utils/events'

@inject(DialogService, EventAggregator, Router, MealService, OrderItemService, MenuService, UserService)
export class Meals {
 
  constructor (dialogService, eventAggregator, router, mealService, orderItemService, menuService, userService) {
    this.dialogService = dialogService
    this.eventAggregator = eventAggregator
    this.router = router
    this.mealService = mealService
    this.orderItemService = orderItemService
    this.menuService = menuService
    this.userService = userService
    this.meals = []
    this.selectedMeal = null
    this.myOrderItems = []
    this.allOrderItems = []
    this.usersWithOrders = []
  }

  async activate (params) {
    this.meals = await this.mealService.getAll()
    if (params?.meal_id) {
      const meal = this.meals.find(x => x.id == params.meal_id)
      if (meal) {
        await this.selectMeal(meal)
        return
      }
    }
    if (this.meals?.length) {
      await this.selectMeal(this.meals[0])
    }
  }

  bind () {
    this.orderItemAddedSub = this.eventAggregator.subscribe(ORDER_ADDED, this.orderAdded.bind(this))
    this.itemOrderedSub = this.eventAggregator.subscribe(ITEM_ORDERED, this.itemOrdered.bind(this))
    this.mealClosedSub = this.eventAggregator.subscribe(MEAL_CLOSED, this.mealClosed.bind(this))
  }

  unbind () {
    this.mealClosedSub.dispose()
    this.itemOrderedSub.dispose()
    this.orderItemAddedSub.dispose()
  }

  @computedFrom('selectedMeal')
  get mealOwner () {
    return this.selectedMeal && this.selectedMeal.ownerId === AuthorizeStep.user.id
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
      model: null,
      lock: true
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        const meal = await this.mealService.create(response.output)
        this.meals.unshift(meal)
        this.navigateToMeal(meal.id)
      }
    })
  }

  async editMeal (meal) {
    this.dialogService.open({
      viewModel: MealEditor,
      model: meal,
      lock: true
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        const updated = await this.mealService.update(response.output)
        Object.assign(meal, updated)
      }
    })
  }

  navigateToMeal (mealId) {
    this.router.navigateToRoute('meals', { meal_id: mealId })
  }

  async selectMeal (meal) {
    this.selectedMeal = meal
    this.menu = await this.menuService.getMenu(meal.menuId)
    if (meal.closed) {
       this.allOrderItems = await this.orderItemService.getOrderItemsForMeal(meal)
       this.aggregatedOrderItems = this.aggregateOrderItems(this.allOrderItems)
    } else {
      this.myOrderItems = await this.orderItemService.getAllForCurrentUserMeal(meal)
      this.usersWithOrders = await this.userService.getUsersWithOrdersForMeal(meal.id)
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

  aggregateOrderItems (orderItems) {
    const results = []
    for (const item of orderItems) {
      const result = results.find(x => x.menuItem.id == item.menuItem.id)
      if (result == null) {
        results.push(new OrderItem(item))
      } else {
        result.quantity += item.quantity
      }
    }
    return results
  }

  async itemOrdered (itemArg) {
    if (this.selectedMeal.id === itemArg.mealId) {
      this.usersWithOrders = await this.userService.getUsersWithOrdersForMeal(itemArg.mealId)
    }
  }

  mealClosed (mealArg) {
    if (this.selectedMeal.id === mealArg.mealId) {
      this.selectedMeal.closed = true
      this.selectMeal(this.selectedMeal)
    }
  }
}