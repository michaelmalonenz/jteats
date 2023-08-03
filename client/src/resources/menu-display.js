export class MenuDisplay {
    constructor (menu) {
        this.menu = menu
        this.model = menu
    }

    get id () {
        return this.menu.id
    }

    matches (other) {
        return other?.id === this.menu.id
    }
}