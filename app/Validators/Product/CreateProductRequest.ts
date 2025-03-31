import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'

export default class CreateProductRequest {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    code: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50),
      rules.unique({table: Product.table, column: 'code'})
    ]),
    name: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    description: schema.string({ trim: true }, [
      rules.maxLength(500)
    ]),
    photo_url: schema.string.optional({ trim: true, escape: true }, [
      rules.maxLength(500)
    ]),
    photo_gallery: schema.array.optional([
      rules.minLength(1),
      rules.maxLength(10)
    ]).members(schema.string({escape: true, trim: true})),
    quantity: schema.number.optional()
  })

  public messages = {
    'code.required': 'Code is required',
    'code.maxLength': 'Code max length is 50',
    'code.unique': 'Code already exist',
    'name.required': 'Name is required',
    'name.maxLength': 'Name max length is 50',
    'description.required': 'Description is required',
    'description.maxLength': 'Description max length is 500',
    'photo_url.maxLength': 'Photo URL max length is 500',
    'photo_gallery.array': 'Photo Gallery must be an array',
    'photo_gallery.minLength': 'At least one item for photo gallery is required',
    'photo_gallery.maxLength': 'Photo Gallery maximum item should be 10',
    'quantity.number': 'Quantity must be a number'
  }
}
