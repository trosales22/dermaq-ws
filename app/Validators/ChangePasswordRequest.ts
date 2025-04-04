import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChangePasswordRequest {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    old_password: schema.string({ trim: true, escape: true }),
    new_password: schema.string({ trim: true, escape: true }, [
      rules.minLength(8),
      rules.maxLength(16)
    ]),
  })

  public messages = {
    'old_password.required': 'Old password is required',
    'new_password.required': 'New password is required',
    'new_password.minLength': 'New password must be at least 8 characters',
    'new_password.maxLength': 'New password length exceeds. Maximum length is 16'
  }
}
