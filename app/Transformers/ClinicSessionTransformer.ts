import { TransformerAbstract } from '@ioc:Adonis/Addons/Bumblebee'
import GeneralConstants from 'App/Constants/GeneralConstants'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'

export default class ClinicSessionTransformer extends TransformerAbstract {
  public async transform(model: any) {
    const sessionDate = model.session_date
    const startTime = model.start_time
    const endTime = model.end_time
    const maxSlots: number = model.max_slots
    const reservations = model.reservations || []

    return {
      id: model.uuid,
      refno: model.refno,
      title: model.title,
      description: model.description,
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
      formatted_session_date: DateFormatterHelper.formatDateToHuman(sessionDate, startTime),
      formatted_start_time: DateFormatterHelper.formatTimeTo12Hour(sessionDate, startTime),
      formatted_end_time: DateFormatterHelper.formatTimeTo12Hour(sessionDate, endTime),
      total_reservations: {
        overall: reservations.length,
        confirmed: reservations.filter(item => item.status === GeneralConstants.RESERVATION_STATUS_CODES.CONFIRMED).length,
        completed: reservations.filter(item => item.status === GeneralConstants.RESERVATION_STATUS_CODES.COMPLETED).length,
        unattended: reservations.filter(item => item.status === GeneralConstants.RESERVATION_STATUS_CODES.UNATTENDED).length
      },
      max_slots: maxSlots,
      remaining_slots: (maxSlots - reservations.length),
      status: {
        code: model.status,
        label: GeneralConstants.CLINIC_SESSION_STATUS_LABELS[model.status]
      },
      created_at: DateFormatterHelper.formatDate(model.created_at),
      updated_at: DateFormatterHelper.formatDate(model.updated_at)
    }
  }
}
