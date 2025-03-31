import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_id: schema.string({ escape: true, trim: true }),
    password: schema.string({ escape: true, trim: true }),
  })

  public messages = {
    'user_id.required': 'User ID is required',
    'password.required': 'Password is required',
  }
}
