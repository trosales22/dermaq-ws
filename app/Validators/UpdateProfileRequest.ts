import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UpdateProfileRequest {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true, escape: true }, [
      rules.unique({
        table: User.table,
        column: 'username',
        whereNot: {
          uuid: this.ctx.auth.user!.uuid
        }
      })
    ]),
    email: schema.string({ trim: true, escape: true }, [
      rules.unique({
        table: User.table,
        column: 'email',
        whereNot: {
          uuid: this.ctx.auth.user!.uuid
        }
      }),
      rules.email(),
      rules.maxLength(50)
    ]),
    firstname: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    lastname: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50)
    ])
  })

  public messages = {
    'username.required': 'Username is required',
    'username.unique': 'Username already exist',
    'email.required': 'Email is required',
    'email.unique': 'Email already exist',
    'email.email': 'Email must be a valid format',
    'email.maxLength': 'Email max length is 50',
    'firstname.required': 'Firstname is required',
    'firstname.maxLength': 'Firstname max length is 50',
    'lastname.required': 'Lastname is required',
    'lastname.maxLength': 'Lastname max length is 50'
  }
}
