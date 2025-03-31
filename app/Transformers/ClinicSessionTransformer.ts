import { TransformerAbstract } from '@ioc:Adonis/Addons/Bumblebee'
import GeneralConstants from 'App/Constants/GeneralConstants'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'

export default class ClinicSessionTransformer extends TransformerAbstract {
  public async transform(model: any) {
    return {
      id: model.uuid,
      refno: model.refno,
      session_date: model.session_date,
      start_time: model.start_time,
      end_time: model.end_time,
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
