import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JSONSerializerHelper from 'App/Helpers/JSONSerializerHelper'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'
import GeneralHelper from 'App/Helpers/GeneralHelper'
import ClinicSessionRepository from 'App/Repositories/ClinicSessionRepository'
import ClinicSessionTransformer from 'App/Transformers/ClinicSessionTransformer'
import ClinicSession from 'App/Models/ClinicSession'
import ListClinicSessionRequest from 'App/Validators/ClinicSession/ListClinicSessionRequest'
import ViewClinicSessionRequest from 'App/Validators/ClinicSession/ViewClinicSessionRequest'
import CreateClinicSessionRequest from 'App/Validators/ClinicSession/CreateClinicSessionRequest'
import UpdateClinicSessionRequest from 'App/Validators/ClinicSession/UpdateClinicSessionRequest'
import DeleteClinicSessionRequest from 'App/Validators/ClinicSession/DeleteClinicSessionRequest'
import GeneralConstants from 'App/Constants/GeneralConstants'
import Reservation from 'App/Models/Reservation'
import ViewClinicSessionByRefNoRequest from 'App/Validators/ClinicSession/ViewClinicSessionByRefNoRequest'
import UpdateReservationRequest from 'App/Validators/Reservation/UpdateReservationRequest'
import FirebaseHelper from 'App/Helpers/FirebaseHelper'
import ReservationRepository from 'App/Repositories/ReservationRepository'
import ViewReservationQueueInfoRequest from 'App/Validators/Reservation/ViewReservationQueueInfoRequest'

export default class ClinicSessionController {
  private clinicSessionRepo: ClinicSessionRepository
  private reservationRepo: ReservationRepository

  constructor() {
    this.clinicSessionRepo = new ClinicSessionRepository()
    this.reservationRepo = new ReservationRepository()
  }

  // @ts-ignore
  public async index({ auth, request, response, transform }: HttpContextContract) {
    await request.validate(ListClinicSessionRequest)

    const list = await this.clinicSessionRepo.getAll({
      q: request.input('q', null),
      page: request.input('page', 1),
      limit: request.input('limit', 25)
    })

    const serializedList = list.serialize()
    const transformed = await transform.collection(serializedList.data, ClinicSessionTransformer)
    const serialized = JSONSerializerHelper.serialize(ClinicSession.table, serializedList.meta, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async indexNonAuth({ request, response, transform }: HttpContextContract){
    await request.validate(ListClinicSessionRequest)

    const list = await this.clinicSessionRepo.getAll({
      q: request.input('q', null),
      page: request.input('page', 1),
      limit: request.input('limit', 25),
      status: GeneralConstants.CLINIC_SESSION_STATUS_CODES.OPEN
    })

    const serializedList = list.serialize()
    const transformed = await transform.collection(serializedList.data, ClinicSessionTransformer)
    const serialized = JSONSerializerHelper.serialize(ClinicSession.table, serializedList.meta, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async showByRefNo({ params, request, response, transform }: HttpContextContract) {
    await request.validate(ViewClinicSessionByRefNoRequest)

    const data = await this.clinicSessionRepo.getByRefno(params.refno)
    const transformed = await transform.item(data, ClinicSessionTransformer)
    const serialized = JSONSerializerHelper.serialize(ClinicSession.table, null, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async show({ params, request, response, transform }: HttpContextContract) {
    await request.validate(ViewClinicSessionRequest)

    const data = await this.clinicSessionRepo.getById(params.id)
    const transformed = await transform.item(data, ClinicSessionTransformer)
    const serialized = JSONSerializerHelper.serialize(ClinicSession.table, null, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async store({ auth, request, response, transform }: HttpContextContract) {
    await request.validate(CreateClinicSessionRequest)

    let payload = request.only([
      'title', 'description',
      'session_date', 'start_time', 'end_time', 'max_slots'
    ])

    payload['refno'] = GeneralHelper.generateClinicSessionRefNo()
    payload['status'] = GeneralConstants.CLINIC_SESSION_STATUS_CODES.OPEN
    const created = await this.clinicSessionRepo.add(payload)

    const data = await this.clinicSessionRepo.getById(created.uuid)
    const transformed = await transform.item(data, ClinicSessionTransformer)
    const serialized = JSONSerializerHelper.serialize(ClinicSession.table, null, transformed)

    return response.created(serialized)
  }

  // @ts-ignore
  public async update({ auth, params, request, response, transform }: HttpContextContract) {
    await request.validate(UpdateClinicSessionRequest)

    const clinicSessionId = params.id

    let payload = request.only([
      'title', 'description',
      'session_date', 'start_time', 'end_time', 'status', 'max_slots'
    ])

    const updatedAt = DateFormatterHelper.getCurrentTimestamp()
    payload['updated_at'] = updatedAt
    await this.clinicSessionRepo.update(clinicSessionId, payload)

    const data = await this.clinicSessionRepo.getById(clinicSessionId)
    const transformed = await transform.item(data, ClinicSessionTransformer)
    const serialized = JSONSerializerHelper.serialize(ClinicSession.table, null, transformed)

    return response.json(serialized)
  }

  public async destroy({ params, request, response }: HttpContextContract) {
    await request.validate(DeleteClinicSessionRequest)

    const clinicSessionId = params.id

    const reservationData = await Reservation.query()
      .where('clinic_session_id', clinicSessionId)
      .first()

    if(Boolean(reservationData)){
      return response.badRequest({
        code: 400,
        message: `Unable to delete clinic session because there are existing reservations associated with it. Please cancel the reservations first.`
      })
    }

    await this.clinicSessionRepo.delete(clinicSessionId)
    return response.status(204).json(null)
  }

  public async getQueueInfo({ params, request, response }: HttpContextContract){
    await request.validate(ViewReservationQueueInfoRequest)

    const clinicSessionId = params.id
    const currentQueueData = await this.reservationRepo.getCurrentQueueBySessionId(clinicSessionId)
    const lastQueueData = await this.reservationRepo.getLastQueueBySessionId(clinicSessionId)
    let nowServingRes: any = null

    if(currentQueueData){
      nowServingRes = {
        queue: currentQueueData?.queue_number,
        refno: currentQueueData?.refno,
        customer: `${currentQueueData?.customer?.firstname} ${currentQueueData?.customer?.lastname}`
      }
    }

    return response.json({
      now_serving: nowServingRes,
      last_queue: lastQueueData?.queue_number || 0
    })
  }

  public async updateReservation({ params, request, response }: HttpContextContract){
    await request.validate(UpdateReservationRequest)

    const clinicSessionId = params.id
    const reservationRefNo = params.refno
    const payload = request.only(['status'])
    const status = payload.status

    const clinicSessionData = await this.clinicSessionRepo.getById(clinicSessionId)
    const reservationData = await this.reservationRepo.getByRefNo(reservationRefNo)

    await this.reservationRepo.update(reservationData?.uuid, {
      status: status,
      updated_at: DateFormatterHelper.getCurrentTimestamp()
    })

    await FirebaseHelper.updateQueueStatus({
      cs_refno: clinicSessionData?.refno,
      queue_no: String(reservationData?.queue_number),
      status: status
    })

    return response.json({
      code: 200,
      message: 'Update reservation successfully.'
    })
  }
}
