import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order';

export default class DeleteOrderRequest {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({escape: true, trim: true}, [
        rules.exists({table: Order.table, column: 'uuid'})
      ])
    })
  })

  public messages = {
    'params.id.required': 'Order ID is required',
    'params.id.exists': 'Order ID does not exist'
  }
}
