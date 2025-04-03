import { TransformerAbstract } from '@ioc:Adonis/Addons/Bumblebee'
import GeneralConstants from 'App/Constants/GeneralConstants'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'

export default class StaffTransformer extends TransformerAbstract {
  public async transform(model: any) {
    const status = model.status

    return {
      id: model.uuid,
      username: model.username,
      email: model.email,
      mobile: model.mobile,
      firstname: model.firstname,
      lastname: model.lastname,
      photo_url: model.photo_url,
      status: {
        code: status,
        label: GeneralConstants.GENERAL_STATUS_LABELS[status] || status
      },
      profile_type: model.profile_type,
      created_at: DateFormatterHelper.formatDate(model.created_at),
      updated_at: DateFormatterHelper.formatDate(model.updated_at)
    }
  }
}
