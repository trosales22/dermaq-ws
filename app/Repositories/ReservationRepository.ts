import GeneralConstants from "App/Constants/GeneralConstants";
import CreateException from "App/Exceptions/CreateException";
import NotFoundException from "App/Exceptions/NotFoundException";
import UpdateException from "App/Exceptions/UpdateException";
import Reservation from "App/Models/Reservation";

export default class ReservationRepository {
  constructor() {}

  async getAll(filters: any) {
    let {
      q,
      sort_by: sortBy = 'id',
      sort_direction: sortDirection = 'desc',
      clinic_session_id: clinicSessionId,
      customer_id: customerId
    } = filters

    let queryModel = Reservation.query().preload('clinicSession').preload('customer')

    if(q){
      queryModel
        .where('refno', 'LIKE', '%' + q + '%')
    }

    if(clinicSessionId){
      queryModel.where('clinic_session_id', clinicSessionId)
    }

    if(customerId){
      queryModel.where('customer_id', customerId)
    }

    return await queryModel
      .orderBy(sortBy, sortDirection)
      .paginate(filters.page, filters.limit)
  }

  async getByRefNo(refno: string) {
    return Reservation.query()
      .where('refno', refno)
      .firstOrFail()
      .then((res) => {
        return res.serialize()
      }, (err) => {
        throw new NotFoundException('reservation', err.message)
      }
    )
  }

  async getCurrentQueueBySessionId(clinicSessionId: string) {
    return Reservation.query()
      .preload('customer')
      .where('clinic_session_id', clinicSessionId)
      .where('status', GeneralConstants.RESERVATION_STATUS_CODES.CONFIRMED)
      .orderBy('queue_number', 'asc')
      .firstOrFail()
      .then((res) => {
        return res.serialize()
      }, () => {
        return null
      }
    )
  }

  async getLastQueueBySessionId(clinicSessionId: string) {
    return Reservation.query()
      .preload('customer')
      .where('clinic_session_id', clinicSessionId)
      .where('status', GeneralConstants.RESERVATION_STATUS_CODES.CONFIRMED)
      .orderBy('queue_number', 'desc')
      .firstOrFail()
      .then((res) => {
        return res.serialize()
      }, () => {
        return null
      }
    )
  }

  async getCountByClinicSessionId(uuid: string) {
    const query: any = Reservation.query()
      .where('clinic_session_id', uuid)
      .where('status', GeneralConstants.RESERVATION_STATUS_CODES.CONFIRMED)
      .count('* as count')
      .first()

    return query?.count || 0;
  }

  async getCountByParams(clinicSessionId: string, customerId: string): Promise<number>{
    const query: any = await Reservation.query()
      .where('clinic_session_id', clinicSessionId)
      .where('customer_id', customerId)
      .first()

    return query?.count || 0;
  }

  async add(data){
    return await Reservation.create(data).then(
      (created) => {
        return created.serialize()
      },
      (err) => {
        throw new CreateException('reservation', err.message)
      }
    )
  }

  async update(uuid: string, dataToBeAdded) {
      return await Reservation.query().update(dataToBeAdded).where('uuid', uuid).then(
        (response) => {
          return response
        },
        (error) => {
          throw new UpdateException('reservation', error.message)
        }
      )
    }
}
