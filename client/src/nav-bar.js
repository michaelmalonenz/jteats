import { bindable, customElement } from 'aurelia-framework'
import { AuthorizeStep } from './security/authorise'

@customElement('nav-bar')
@bindable('router')
export class NavBar {

  get loggedIn () {
    return AuthorizeStep.user != null
  }

  get isLoading () {
    return this.router.isNavigating
  }

}
