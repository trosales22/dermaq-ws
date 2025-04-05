import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import GeneralConstants from 'App/Constants/GeneralConstants'
import User from './User'
import OrderProduct from './OrderProduct'

export default class Order extends BaseModel {
  public static table = 'orders'

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

  @column({ serializeAs: 'refno', columnName: 'refno' })
  public refno: string

  @column({ serializeAs: 'customer_id', columnName: 'customer_id' })
  public customerId: string

  @column({
    serializeAs: 'total_amount',
    columnName: 'total_amount',
    consume: (value: string) => Number(value)
  })
  public totalAmount: number;

  @column({ serializeAs: 'assisted_by_id', columnName: 'assisted_by_id' })
  public assistedById: string

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
  public static setUuid(order: Order) {
    order.uuid = uuidv4()
  }

  @belongsTo(() => User, {
    localKey: 'uuid',
    foreignKey: 'customerId'
  })
  public customer: BelongsTo<typeof User>

  @belongsTo(() => User, {
    localKey: 'uuid',
    foreignKey: 'assistedById'
  })
  public assistant: BelongsTo<typeof User>

  @hasMany(() => OrderProduct, {
    localKey: 'uuid',
    foreignKey: 'orderId'
  })
  public products: HasMany<typeof OrderProduct>
}
