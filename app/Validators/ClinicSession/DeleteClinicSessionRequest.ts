import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClinicSession from 'App/Models/ClinicSession';

export default class DeleteClinicSessionRequest {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({escape: true, trim: true}, [
        rules.exists({table: ClinicSession.table, column: 'uuid'})
      ])
    })
  })

  public messages = {
    'params.id.required': 'Clinic Session ID is required',
    'params.id.exists': 'Clinic Session ID does not exist'
  }
}
