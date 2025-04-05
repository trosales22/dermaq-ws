import {schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ListOrderRequest {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    page: schema.number.optional(),
    limit: schema.number.optional()
  })

  public messages = {
    'page.number': 'Page must be a number',
    'limit.number': 'Limit must be a number'
  }
}
