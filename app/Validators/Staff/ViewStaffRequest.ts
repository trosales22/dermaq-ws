import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import GeneralConstants from 'App/Constants/GeneralConstants';

export default class ViewStaffRequest {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({escape: true, trim: true}, [
        rules.exists({table: User.table, column: 'uuid', where: {
          profile_type: GeneralConstants.ROLE_TYPES.STAFF
        }})
      ])
    })
  })

  public messages = {
    'params.id.required': 'Staff ID is required',
    'params.id.exists': 'Staff ID does not exist'
  }
}
