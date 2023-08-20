export class UserSettings {
    constructor (settings) {
        this.id = null
        this.user_id = null
        this.user = null
        this.accountNumber = null
        Object.assign(this, settings)
    }
}