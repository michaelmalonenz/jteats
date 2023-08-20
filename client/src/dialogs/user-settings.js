import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

@inject(DialogController)
export class UserSettings {

    constructor (dialogController) {
        this.controller = dialogController
        this.settings = null
    }

    activate (model) {
        this.settings = model
    }

    close () {
        this.controller.cancel()
    }

    save () {
        this.controller.ok()
    }
    
}