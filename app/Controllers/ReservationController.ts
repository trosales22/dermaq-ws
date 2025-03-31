import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JSONSerializerHelper from 'App/Helpers/JSONSerializerHelper'
import Reservation from 'App/Models/Reservation'
import ReservationRepository from 'App/Repositories/ReservationRepository'
import ReservationTransformer from 'App/Transformers/ReservationTransformer'
import ListReservationRequest from 'App/Validators/Reservation/ListReservationRequest'

export default class ReservationController {
  private reservationRepo: ReservationRepository

  constructor() {
    this.reservationRepo = new ReservationRepository()
  }

  // @ts-ignore
  public async index({ auth, request, response, transform }: HttpContextContract) {
    await request.validate(ListReservationRequest)

    const list = await this.reservationRepo.getAll({
      q: request.input('q', null),
      page: request.input('page', 1),
      limit: request.input('limit', 25),
      clinic_session_id: request.input('clinic_session_id', null),
      customer_id: request.input('customer_id', null)
    })

    const serializedList = list.serialize()
    const transformed = await transform.collection(serializedList.data, ReservationTransformer)
    const serialized = JSONSerializerHelper.serialize(Reservation.table, serializedList.meta, transformed)

    return response.json(serialized)
  }
}
