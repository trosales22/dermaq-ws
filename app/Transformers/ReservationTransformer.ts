import { TransformerAbstract } from '@ioc:Adonis/Addons/Bumblebee'
import GeneralConstants from 'App/Constants/GeneralConstants'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'

export default class ReservationTransformer extends TransformerAbstract {
  public async transform(model: any) {
    const customer = model.customer
    let customerArr: any = null

    if(customer){
      customerArr = {
        id: customer.uuid,
        email: customer.email,
        fullname: customer.firstname + ' ' + customer.lastname,
        mobile: customer.mobile,
        photo_url: customer.photo_url
      }
    }

    const clinicSession = model.clinicSession
    let clinicSessionArr: any = null

    if(clinicSession){
      clinicSessionArr = {
        id: clinicSession.uuid,
        refno: clinicSession.refno,
        session_date: clinicSession.session_date,
        start_time: clinicSession.start_time,
        end_time: clinicSession.end_time,
        max_slots: clinicSession.max_slots
      }
    }

    return {
      id: model.uuid,
      refno: model.refno,
      clinic_session: clinicSessionArr,
      customer: customerArr,
      status: {
        code: model.status,
        label: GeneralConstants.RESERVATION_STATUS_LABELS[model.status]
      },
      queue_number: model.queue_number,
      created_at: DateFormatterHelper.formatDate(model.created_at),
      updated_at: DateFormatterHelper.formatDate(model.updated_at)
    }
  }
}
