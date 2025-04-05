import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JSONSerializerHelper from 'App/Helpers/JSONSerializerHelper'
import UserRepository from 'App/Repositories/UserRepository'
import User from 'App/Models/User'
import GeneralConstants from 'App/Constants/GeneralConstants'
import CustomerTransformer from 'App/Transformers/CustomerTransformer'
import ListCustomerRequest from 'App/Validators/Customer/ListCustomerRequest'
import ViewCustomerRequest from 'App/Validators/Customer/ViewCustomerRequest'

export default class CustomerMgmtController {
  private userRepo: UserRepository

  constructor() {
    this.userRepo = new UserRepository()
  }

  // @ts-ignore
  public async index({ params, request, response, transform }: HttpContextContract) {
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
  public async show({ params, request, response, transform }: HttpContextContract) {
    await request.validate(ViewCustomerRequest)

    const data = await this.userRepo.getById(params.id)
    const transformed = await transform.item(data, CustomerTransformer)
    const serialized = JSONSerializerHelper.serialize(User.table, null, transformed)

    return response.json(serialized)
  }
}
