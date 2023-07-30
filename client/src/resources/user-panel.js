import { customElement, computedFrom } from 'aurelia-framework'
import { AuthorizeStep } from '../security/authorise'


@customElement('user-panel')
export class UserPanel {

  constructor () {
  }

  @computedFrom('currentUser')
  get loggedIn() {
    return this.currentUser != null
  }

  get currentUser () {
    return AuthorizeStep.user
  }
}
