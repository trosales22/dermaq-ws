import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import User from 'App/Models/User'
import GeneralConstants from 'App/Constants/GeneralConstants'

export default class CreateOrderRequest {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    customer_id: schema.string({escape: true, trim: true}, [
      rules.exists({
        table: User.table,
        column: 'uuid',
        where: {
          profile_type: GeneralConstants.ROLE_TYPES.CUSTOMER
        }
      })
    ]),
    orders: schema.array().members(
      schema.object().members({
        product_id: schema.string({escape: true, trim: true}, [
          rules.exists({table: Product.table, column: 'uuid'})
        ]),
        quantity: schema.number()
      })
    )
  })

  public messages = {
    'customer_id.required': 'Customer ID is required',
    'customer_id.exists': 'Customer ID does not exist',
    'orders.required': 'Orders is required',
    'orders.array': 'Orders must be an array of objects',
    'orders.*.product_id.required': 'Each order must have a product ID',
    'orders.*.product_id.exists': 'Product ID does not exist',
    'orders.*.quantity.required': 'Each order must have a quantity',
    'orders.*.quantity.number': 'Quantity must be a number'
  }
}
