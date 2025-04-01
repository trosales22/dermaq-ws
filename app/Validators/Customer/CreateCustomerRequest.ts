import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class CreateCustomerRequest {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true, escape: true }, [
      rules.unique({table: User.table, column: 'username', caseInsensitive: true})
    ]),
    email: schema.string({ trim: true, escape: true }, [
      rules.unique({table: User.table, column: 'email', caseInsensitive: true}),
      rules.email(),
      rules.maxLength(50)
    ]),
    firstname: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    lastname: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    password: schema.string({ trim: true, escape: true }, [
      rules.minLength(8),
      rules.maxLength(16)
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
    'lastname.maxLength': 'Lastname max length is 50',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be atleast 8 characters',
    'password.maxLength': 'Password max length is 16'
  }
}
