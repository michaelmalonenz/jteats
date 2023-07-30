import { inject, bindable, customElement } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'

@customElement('nav-bar')
@bindable('router')
@inject(DialogService, EventAggregator)
export class NavBar {

  constructor (dialogService, eventAggregator) {
    this.dialogService = dialogService
    this.eventAggregator = eventAggregator
  }

}
