import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import GeneralConstants from 'App/Constants/GeneralConstants'
import ClinicSession from './ClinicSession'
import User from './User'

export default class Reservation extends BaseModel {
  public static table = 'reservations'

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
  public refno: string;

  @column({ serializeAs: 'clinic_session_id', columnName: 'clinic_session_id' })
  public clinicSessionId: string;

  @column({ serializeAs: 'customer_id', columnName: 'customer_id' })
  public customerId: string;

  @column({ serializeAs: 'status', columnName: 'status' })
  public status: string;

  @column({
    serializeAs: 'queue_number',
    columnName: 'queue_number',
    consume: (value: string) => Number(value)
  })
  public queueNumber: number;

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
  public static setId(reservation: Reservation) {
    reservation.uuid = uuidv4()
  }

  @belongsTo(() => ClinicSession, {
    localKey: 'uuid',
    foreignKey: 'clinicSessionId'
  })
  public clinicSession: BelongsTo<typeof ClinicSession>

  @belongsTo(() => User, {
    localKey: 'uuid',
    foreignKey: 'customerId'
  })
  public customer: BelongsTo<typeof User>
}
