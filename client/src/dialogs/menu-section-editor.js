import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

@inject(DialogController)
export class MenuSectionEditor {

    constructor (dialogController) {
        this.controller = dialogController
        this.sectionName = ''
        this.description = ''
        this.menuId = null
    }

    activate (model) {
        this.menuId = model.menuId
    }

    save () {
        this.controller.ok({
            menuId: this.menuId,
            name: this.sectionName,
            description: this.description,
        })
    }

    close () {
        this.controller.cancel()
    }
}