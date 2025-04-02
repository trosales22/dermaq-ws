import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClinicSession from 'App/Models/ClinicSession'

export default class ListCustomerReservedQueueRequest {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    params: schema.object().members({
      refno: schema.string({escape: true, trim: true}, [
        rules.exists({table: ClinicSession.table, column: 'refno'})
      ])
    }),
    page: schema.number.optional(),
    limit: schema.number.optional()
  })

  public messages = {
    'params.refno.required': 'Reference Number is required',
    'params.refno.exists': 'Reference Number does not exist',
    'page.number': 'Page must be a number',
    'limit.number': 'Limit must be a number'
  }
}
