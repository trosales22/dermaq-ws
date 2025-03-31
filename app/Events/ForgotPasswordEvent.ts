import Event from '@ioc:Adonis/Core/Event'
import User from 'App/Models/User'

export default class ForgotPasswordEvent {
  public static async dispatch(user: User, resetToken: string) {
    Event.emit('forgot::password', { user, resetToken })
  }
}
