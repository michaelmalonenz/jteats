import { inject, DOM } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

@inject(DialogController, DOM.Element)
export class MenuSectionEditor {

    constructor (dialogController, element) {
        this.controller = dialogController
        this.element = element
        this.name = ''
        this.description = ''
        this.menuId = null
        this.menuSectionId = null

        this.header = 'Add Menu Section'
        this.boundKeyDown = this.keydown.bind(this)
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

    keydown (event) {
        if (event.key === 'Enter') {
          this.save()
        }
      }

      attached () {
        this.element.addEventListener('keydown', this.boundKeyDown)
      }

      detached () {
        this.element.removeEventListener('keydown', this.boundKeyDown)
      }
}