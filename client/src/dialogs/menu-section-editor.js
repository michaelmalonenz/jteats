import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

@inject(DialogController)
export class MenuSectionEditor {

    constructor (dialogController) {
        this.controller = dialogController
        this.name = ''
        this.description = ''
        this.menuId = null
        this.menuSectionId = null

        this.header = 'Add Menu Section'
    }

    activate (model) {
        this.menuId = model.menuId
        if (model.section) {
            this.header = 'Edit Menu Section'
            this.name = model.section.name
            this.description = model.section.description
            this.menuSectionId = model.section.id
        }
    }

    save () {
        this.controller.ok({
            id: this.menuSectionId,
            menuId: this.menuId,
            name: this.name,
            description: this.description,
        })
    }

    close () {
        this.controller.cancel()
    }
}