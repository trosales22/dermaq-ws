import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product';

export default class UpdateProductRequest {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({escape: true, trim: true}, [
        rules.exists({table: Product.table, column: 'uuid'})
      ])
    }),
   code: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50),
      rules.unique({
        table: Product.table,
        column: 'code',
        whereNot: {
          uuid: this.ctx.params.id
        }
      })
    ]),
    name: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    description: schema.string.optional({ trim: true }, [
      rules.maxLength(500)
    ]),
    photo_url: schema.string.optional({ trim: true, escape: true }, [
      rules.maxLength(500)
    ]),
    photo_gallery: schema.array.optional([
      rules.maxLength(10)
    ]).members(schema.string({escape: true, trim: true})),
    price: schema.number.optional(),
    quantity: schema.number.optional()
  })

  public messages = {
    'params.id.required': 'Product ID is required',
    'params.id.exists': 'Product ID does not exist',
    'code.required': 'Code is required',
    'code.maxLength': 'Code max length is 50',
    'name.required': 'Name is required',
    'name.maxLength': 'Name max length is 50',
    'description.maxLength': 'Description max length is 500',
    'photo_url.maxLength': 'Photo URL max length is 500',
    'photo_gallery.array': 'Photo Gallery must be an array',
    'photo_gallery.maxLength': 'Photo Gallery maximum item should be 10',
    'price.number': 'Price must be a number',
    'quantity.number': 'Quantity must be a number'
  }
}
