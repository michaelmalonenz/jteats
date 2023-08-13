import { EventAggregator } from 'aurelia-event-aggregator'
import { inject } from 'aurelia-framework'
import { io } from 'socket.io-client'
import { MEAL_CLOSED, ITEM_ORDERED } from '../utils/events'

@inject(EventAggregator)
export class WebSocket {

    constructor (eventAggregator) {
        this.eventAggregator = eventAggregator
        this.socket = io()
        this.socket.on('meal_closed', this.mealClosed.bind(this))
        this.socket.on('item_ordered', this.itemOrdered.bind(this))
    }

    mealClosed (arg) {
        this.eventAggregator.publish(MEAL_CLOSED, arg)
    }

    itemOrdered (arg) {
        this.eventAggregator.publish(ITEM_ORDERED, arg)
    }

}