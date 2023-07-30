import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import { inject } from 'aurelia-framework'
import { AuthorizeStep } from './security/authorise'
import { UserService } from './services/user'

@inject(UserService)
export class App {

  constructor (userService) {
    this.userService = userService
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
      { route: ['', 'meals'], name: 'Meals', moduleId: 'meals', nav: true, title: 'Meals', auth: true, settings: { icon: 'fa-th' } },
    ])

    this.router = router
  }
}
