import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JSONSerializerHelper from 'App/Helpers/JSONSerializerHelper'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'
import Product from 'App/Models/Product'
import UserRepository from 'App/Repositories/UserRepository'
import StaffTransformer from 'App/Transformers/StaffTransformer'
import User from 'App/Models/User'
import GeneralConstants from 'App/Constants/GeneralConstants'
import ListStaffRequest from 'App/Validators/Staff/ListStaffRequest'
import ViewStaffRequest from 'App/Validators/Staff/ViewStaffRequest'
import UpdateStaffRequest from 'App/Validators/Staff/UpdateStaffRequest'
import DeleteStaffRequest from 'App/Validators/Staff/DeleteStaffRequest'
import CreateStaffRequest from 'App/Validators/Staff/CreateStaffRequest'

export default class StaffMgmtController {
  private userRepo: UserRepository

  constructor() {
    this.userRepo = new UserRepository()
  }

  // @ts-ignore
  public async index({ params, request, response, transform }: HttpContextContract) {
    await request.validate(ListStaffRequest)

    const list = await this.userRepo.getAll({
      q: request.input('q', null),
      page: request.input('page', 1),
      limit: request.input('limit', 25),
      profile_type: GeneralConstants.ROLE_TYPES.STAFF
    })

    const serializedList = list.serialize()
    const transformed = await transform.collection(serializedList.data, StaffTransformer)
    const serialized = JSONSerializerHelper.serialize(User.table, serializedList.meta, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async show({ params, request, response, transform }: HttpContextContract) {
    await request.validate(ViewStaffRequest)

    const data = await this.userRepo.getById(params.id)
    const transformed = await transform.item(data, StaffTransformer)
    const serialized = JSONSerializerHelper.serialize(Product.table, null, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async store({ params, request, response, transform }: HttpContextContract) {
    await request.validate(CreateStaffRequest)

    let payload = request.only(['username', 'email', 'firstname', 'lastname', 'mobile', 'password'])
    payload['profile_type'] = GeneralConstants.ROLE_TYPES.STAFF
    const created = await this.userRepo.add(payload)

    const data = await this.userRepo.getById(created.uuid)
    const transformed = await transform.item(data, StaffTransformer)
    const serialized = JSONSerializerHelper.serialize(User.table, null, transformed)

    return response.created(serialized)
  }

  // @ts-ignore
  public async update({ params, request, response, transform }: HttpContextContract) {
    await request.validate(UpdateStaffRequest)

    const userId = params.id

    let payload = request.only(['username', 'email', 'firstname', 'lastname', 'mobile'])
    const updatedAt = DateFormatterHelper.getCurrentTimestamp()
    payload['updated_at'] = updatedAt
    await this.userRepo.update(userId, payload)

    const data = await this.userRepo.getById(userId)
    const transformed = await transform.item(data, StaffTransformer)
    const serialized = JSONSerializerHelper.serialize(User.table, null, transformed)

    return response.json(serialized)
  }

  public async destroy({ params, request, response }: HttpContextContract) {
    await request.validate(DeleteStaffRequest)

    const userId = params.id

    await this.userRepo.delete(userId)
    return response.status(204).json(null)
  }
}
