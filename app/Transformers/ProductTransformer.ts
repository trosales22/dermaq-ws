import { TransformerAbstract } from '@ioc:Adonis/Addons/Bumblebee'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'
import GeneralHelper from 'App/Helpers/GeneralHelper'

export default class ProductTransformer extends TransformerAbstract {
  public async transform(model: any) {
    return {
      id: model.uuid,
      code: model.code,
      name: model.name,
      description: model.description,
      photo_url: model.photo_url,
      photo_gallery: GeneralHelper.parseJsonOrArray(model.photo_gallery),
      price: model.price,
      quantity: model.quantity,
      created_at: DateFormatterHelper.formatDate(model.created_at),
      updated_at: DateFormatterHelper.formatDate(model.updated_at)
    }
  }
}
