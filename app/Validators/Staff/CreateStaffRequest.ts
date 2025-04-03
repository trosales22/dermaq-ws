import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class CreateStaffRequest {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true, escape: true }, [
      rules.unique({table: User.table, column: 'username'})
    ]),
    email: schema.string({ trim: true, escape: true }, [
      rules.unique({table: User.table, column: 'email'}),
      rules.email(),
      rules.maxLength(50)
    ]),
    firstname: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    lastname: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    mobile: schema.string({escape: true, trim: true}, [
      rules.regex(new RegExp('^(\\+639|09|639)[0-9]{9}$')),
      rules.unique({table: User.table, column: 'mobile'})
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
    'mobile.required': 'Mobile number is required',
    'mobile.regex': 'Mobile number format is invalid',
    'mobile.unique': 'Mobile number already exist',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be atleast 8 characters',
    'password.maxLength': 'Password max length is 16'
  }
}
