import { TransformerAbstract } from '@ioc:Adonis/Addons/Bumblebee'
import GeneralConstants from 'App/Constants/GeneralConstants'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'

export default class ClinicSessionTransformer extends TransformerAbstract {
  public async transform(model: any) {
    const sessionDate = model.session_date
    const startTime = model.start_time
    const endTime = model.end_time

    return {
      id: model.uuid,
      refno: model.refno,
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
      formatted_start_time: DateFormatterHelper.formatTimeTo12Hour(sessionDate, startTime),
      formatted_end_time: DateFormatterHelper.formatTimeTo12Hour(sessionDate, endTime),
      max_slots: model.max_slots,
      status: {
        code: model.status,
        label: GeneralConstants.CLINIC_SESSION_STATUS_LABELS[model.status]
      },
      created_at: DateFormatterHelper.formatDate(model.created_at),
      updated_at: DateFormatterHelper.formatDate(model.updated_at)
    }
  }
}
