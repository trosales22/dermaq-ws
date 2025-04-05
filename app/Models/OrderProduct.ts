import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import GeneralConstants from 'App/Constants/GeneralConstants'
import Product from './Product'

export default class OrderProduct extends BaseModel {
  public static table = 'order_products'

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

  @column({ serializeAs: 'order_id', columnName: 'order_id' })
  public orderId: string

  @column({ serializeAs: 'product_id', columnName: 'product_id' })
  public productId: string

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
  public static setUuid(orderProduct: OrderProduct) {
    orderProduct.uuid = uuidv4()
  }

  @belongsTo(() => Product, {
    localKey: 'uuid',
    foreignKey: 'productId'
  })
  public product: BelongsTo<typeof Product>
}
