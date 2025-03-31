import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product';

export default class DeleteProductRequest {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({escape: true, trim: true}, [
        rules.exists({table: Product.table, column: 'uuid'})
      ])
    })
  })

  public messages = {
    'params.id.required': 'Product ID is required',
    'params.id.exists': 'Product ID does not exist'
  }
}
