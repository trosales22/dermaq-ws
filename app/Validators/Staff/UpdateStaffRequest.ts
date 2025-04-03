import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import GeneralConstants from 'App/Constants/GeneralConstants';

export default class UpdateStaffRequest {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({escape: true, trim: true}, [
        rules.exists({table: User.table, column: 'uuid', where: {
          profile_type: GeneralConstants.ROLE_TYPES.STAFF
        }})
      ])
    }),
    username: schema.string.optional({ trim: true, escape: true }, [
      rules.unique({
        table: User.table,
        column: 'username',
        whereNot: {
          uuid: this.ctx.params.id
        }
      })
    ]),
    email: schema.string.optional({ trim: true, escape: true }, [
      rules.unique({
        table: User.table,
        column: 'email',
        whereNot: {
          uuid: this.ctx.params.id
        }
      }),
      rules.email(),
      rules.maxLength(50)
    ]),
    firstname: schema.string.optional({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    lastname: schema.string.optional({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    mobile: schema.string.optional({trim: true}, [
      rules.regex(new RegExp('^(\\+639|09|639)[0-9]{9}$')),
      rules.unique({
        table: User.table,
        column: 'mobile',
        whereNot: {
          uuid: this.ctx.params.id
        }
      })
    ]),
    photo_url: schema.string.optional({ trim: true, escape: true }, [
      rules.maxLength(500)
    ])
  })

  public messages = {
    'params.id.required': 'Staff ID is required',
    'params.id.exists': 'Staff ID does not exist',
    'username.unique': 'Username already exist',
    'email.unique': 'Email already exist',
    'email.email': 'Email must be a valid format',
    'email.maxLength': 'Email max length is 50',
    'firstname.maxLength': 'Firstname max length is 50',
    'lastname.maxLength': 'Lastname max length is 50',
    'mobile.regex': 'Mobile number format is invalid',
    'mobile.unique': 'Mobile number already exist',
    'photo_url.maxLength': 'Photo URL max length is 500',
  }
}
