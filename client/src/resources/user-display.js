import { bindable } from 'aurelia-framework'

@bindable('user')
@bindable({
  name: 'avatarOnly',
  attribute: 'avatar-only',
  defaultValue: false
})
export class UserDisplay {
    constructor (user) {
        this.user = user
        this.model = user
    }

    matches(other) {
        if (other == null)
            return false
        return other.user?.id === this.user.id
    }
}
