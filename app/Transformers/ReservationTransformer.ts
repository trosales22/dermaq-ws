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
      const sessionDate = clinicSession.session_date
      const startTime = clinicSession.start_time
      const endTime = clinicSession.end_time

      clinicSessionArr = {
        id: clinicSession.uuid,
        refno: clinicSession.refno,
        title: clinicSession.title,
        description: clinicSession.description,
        session_date: sessionDate,
        start_time: startTime,
        end_time: endTime,
        formatted_session_date: DateFormatterHelper.formatDateToHuman(sessionDate, startTime),
        formatted_start_time: DateFormatterHelper.formatTimeTo12Hour(sessionDate, startTime),
        formatted_end_time: DateFormatterHelper.formatTimeTo12Hour(sessionDate, endTime),
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
