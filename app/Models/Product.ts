import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import GeneralConstants from 'App/Constants/GeneralConstants'

export default class Product extends BaseModel {
  public static table = 'products'

  @column({
    isPrimary: true,
    serializeAs: 'id',
    columnName: 'id',
    consume: (value, attribute, model) => {
      return value || model.$getAttribute(attribute)
    },
  })
  public id: number

  @column({ serializeAs: 'uuid', columnName: 'uuid' })
  public uuid: string;

  @column({ serializeAs: 'code', columnName: 'code' })
  public refno: string

  @column({ serializeAs: 'name', columnName: 'name' })
  public name: string

  @column({ serializeAs: 'description', columnName: 'description' })
  public description: string

  @column({ serializeAs: 'photo_url', columnName: 'photo_url' })
  public photoUrl: string

  @column({ serializeAs: 'photo_gallery', columnName: 'photo_gallery' })
  public photoGallery: string

  @column({
    serializeAs: 'price',
    columnName: 'price',
    consume: (value: string) => Number(value)
  })
  public price: number;

  @column({
    serializeAs: 'quantity',
    columnName: 'quantity',
    consume: (value: string) => Number(value)
  })
  public quantity: number;

  @column.dateTime({
    serializeAs: 'created_at',
    columnName: 'created_at',
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone(GeneralConstants.PH_TIMEZONE).toISO() : value
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    serializeAs: 'updated_at',
    columnName: 'updated_at',
    serialize: (value: DateTime | null) => {
      return value ? value.setZone(GeneralConstants.PH_TIMEZONE).toISO() : value
    },
  })
  public updatedAt: DateTime

  @beforeCreate()
  public static setId(product: Product) {
    product.uuid = uuidv4()
  }
}
