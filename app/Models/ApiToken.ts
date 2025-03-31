import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import GeneralConstants from 'App/Constants/GeneralConstants'

export default class ApiToken extends BaseModel {
  public static table = 'api_tokens'

  @column({
    isPrimary: true,
    serializeAs: 'id',
    columnName: 'id',
    consume: (value, attribute, model) => {
      return value || model.$getAttribute(attribute)
    },
  })
  public id: string

  @column({ serializeAs: 'user_id', columnName: 'user_id' })
  public userId: string

  @column({ serializeAs: 'name', columnName: 'name' })
  public name: string

  @column({ serializeAs: 'type', columnName: 'type' })
  public type: string

  @column({ serializeAs: 'token', columnName: 'token' })
  public token: string

  @column.dateTime({
    serializeAs: 'expires_at',
    columnName: 'expires_at',
    serialize: (value: DateTime | null) => {
      return value ? value.setZone(GeneralConstants.PH_TIMEZONE).toISO() : value
    },
  })
  public expiresAt: DateTime

  @column.dateTime({
    serializeAs: 'created_at',
    columnName: 'created_at',
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone(GeneralConstants.PH_TIMEZONE).toISO() : value
    },
  })
  public createdAt: DateTime
}
