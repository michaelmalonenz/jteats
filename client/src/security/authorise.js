import { RedirectToRoute } from 'aurelia-router'

export class AuthorizeStep {

  static user = null

  run (instruction, next) {
    if (instruction.getAllInstructions().some(i => i.config.auth)) {
      var isLoggedIn = AuthorizeStep.user != null
      if (!isLoggedIn) {
        const currentUrl = instruction.fragment + (instruction.queryString ? `?${instruction.queryString}` : '')
        return next.cancel(new RedirectToRoute('login', { return: currentUrl }))
      }
    }

    return next()
  }
}
