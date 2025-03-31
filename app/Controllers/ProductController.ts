import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JSONSerializerHelper from 'App/Helpers/JSONSerializerHelper'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'
import ProductRepository from 'App/Repositories/ProductRepository'
import ProductTransformer from 'App/Transformers/ProductTransformer'
import Product from 'App/Models/Product'
import ViewProductRequest from 'App/Validators/Product/ViewProductRequest'
import UpdateProductRequest from 'App/Validators/Product/UpdateProductRequest'
import DeleteProductRequest from 'App/Validators/Product/DeleteProductRequest'
import CreateProductRequest from 'App/Validators/Product/CreateProductRequest'

export default class ProductController {
  private productRepo: ProductRepository

  constructor() {
    this.productRepo = new ProductRepository()
  }

  // @ts-ignore
  public async index({ params, request, response, transform }: HttpContextContract) {
    const list = await this.productRepo.getAll({
      q: request.input('q', null),
      page: request.input('page', 1),
      limit: request.input('limit', 25)
    })

    const serializedList = list.serialize()
    const transformed = await transform.collection(serializedList.data, ProductTransformer)
    const serialized = JSONSerializerHelper.serialize(Product.table, serializedList.meta, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async show({ params, request, response, transform }: HttpContextContract) {
    await request.validate(ViewProductRequest)

    const data = await this.productRepo.getById(params.id)
    const transformed = await transform.item(data, ProductTransformer)
    const serialized = JSONSerializerHelper.serialize(Product.table, null, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async store({ params, request, response, transform }: HttpContextContract) {
    await request.validate(CreateProductRequest)

    let payload = request.only([
      'code', 'name', 'description', 'photo_url', 'photo_gallery', 'quantity'
    ])

    payload['photo_gallery'] = JSON.stringify(payload.photo_gallery || [])

    const created = await this.productRepo.add(payload)

    const data = await this.productRepo.getById(created.uuid)
    const transformed = await transform.item(data, ProductTransformer)
    const serialized = JSONSerializerHelper.serialize(Product.table, null, transformed)

    return response.created(serialized)
  }

  // @ts-ignore
  public async update({ params, request, response, transform }: HttpContextContract) {
    await request.validate(UpdateProductRequest)

    const productId = params.id

    let payload = request.only(['code', 'name', 'description', 'photo_url', 'photo_gallery', 'quantity'])

    payload['photo_gallery'] = JSON.stringify(payload.photo_gallery || [])

    const updatedAt = DateFormatterHelper.getCurrentTimestamp()
    payload['updated_at'] = updatedAt
    await this.productRepo.update(productId, payload)

    const data = await this.productRepo.getById(productId)
    const transformed = await transform.item(data, ProductTransformer)
    const serialized = JSONSerializerHelper.serialize(Product.table, null, transformed)

    return response.json(serialized)
  }

  public async destroy({ params, request, response }: HttpContextContract) {
    await request.validate(DeleteProductRequest)

    const productId = params.id

    await this.productRepo.delete(productId)
    return response.status(204).json(null)
  }
}
