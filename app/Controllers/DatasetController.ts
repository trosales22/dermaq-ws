import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import GeneralConstants from 'App/Constants/GeneralConstants'
import UserRepository from 'App/Repositories/UserRepository'
import JSONSerializerHelper from 'App/Helpers/JSONSerializerHelper'
import ListCustomerRequest from 'App/Validators/Customer/ListCustomerRequest'
import CustomerTransformer from 'App/Transformers/CustomerTransformer'
import ProductRepository from 'App/Repositories/ProductRepository'
import ProductTransformer from 'App/Transformers/ProductTransformer'
import Product from 'App/Models/Product'

export default class DatasetController {
  private userRepo: UserRepository
  private productRepo: ProductRepository

  constructor() {
    this.userRepo = new UserRepository()
    this.productRepo = new ProductRepository()
  }

  // @ts-ignore
  public async customerIndex({ params, request, response, transform }: HttpContextContract) {
    await request.validate(ListCustomerRequest)

    const list = await this.userRepo.getAll({
      q: request.input('q', null),
      page: request.input('page', 1),
      limit: request.input('limit', 25),
      profile_type: GeneralConstants.ROLE_TYPES.CUSTOMER
    })

    const serializedList = list.serialize()
    const transformed = await transform.collection(serializedList.data, CustomerTransformer)
    const serialized = JSONSerializerHelper.serialize(User.table, serializedList.meta, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async productIndex({ params, request, response, transform }: HttpContextContract) {
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
}
