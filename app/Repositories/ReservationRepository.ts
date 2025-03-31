import CreateException from "App/Exceptions/CreateException";
import Product from "App/Models/Product";
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

  async add(data){
    return await Product.create(data).then(
      (created) => {
        return created.serialize()
      },
      (err) => {
        throw new CreateException('reservation', err.message)
      }
    )
  }
}
