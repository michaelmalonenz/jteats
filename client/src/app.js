import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import { inject, PLATFORM } from 'aurelia-framework'
import { AuthorizeStep } from './security/authorise'
import { UserService } from './services/user'
import { WebSocket } from './services/socketio'

@inject(UserService, WebSocket)
export class App {

  constructor (userService, webSocket) {
    this.userService = userService
    this.webSocket = webSocket
  }

  async activate () {
    try
    {
      AuthorizeStep.user = await this.userService.me()
    }
    catch (err)
    {
      // not logged in
    }
  }

  configureRouter (config, router) {
    config.addPipelineStep('authorize', AuthorizeStep)
    config.map([
      { route: ['', 'meals'], name: 'meals', moduleId: PLATFORM.moduleName('meals'), nav: 1, title: 'Meals', auth: true, settings: { icon: 'fa-cutlery' }, activationStrategy: 'invoke-lifecycle' },
      { route: ['menus'],     name: 'menus', moduleId: PLATFORM.moduleName('menus'), nav: 2, title: 'Menus', auth: true, settings: { icon: 'fa-book' } },
      { route: ['help'],      name: 'help',  moduleId: PLATFORM.moduleName('help'),  nav: 3, title: 'Help',  auth: true, settings: { icon: 'fa-question' } },
    ])
    config.options.pushState = true;

    this.router = router
  }
}
