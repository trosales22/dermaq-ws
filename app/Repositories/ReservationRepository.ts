import GeneralConstants from "App/Constants/GeneralConstants";
import CreateException from "App/Exceptions/CreateException";
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

  async getCountByClinicSessionId(uuid: string) {
    const query: any = Reservation.query()
      .where('clinic_session_id', uuid)
      .where('status', GeneralConstants.RESERVATION_STATUS_CODES.CONFIRMED)
      .count('* as count')
      .first()

    return query?.count || 0;
  }

  async isExistsByParams(clinicSessionId: string, customerId: string): Promise<boolean>{
    const exists = Reservation.query()
      .where('clinic_session_id', clinicSessionId)
      .where('customer_id', customerId)
      .first()

    return Boolean(exists)
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
