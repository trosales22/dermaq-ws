import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import GeneralConstants from 'App/Constants/GeneralConstants'

export default class ClinicSession extends BaseModel {
  public static table = 'clinic_sessions'

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

  @column({
    serializeAs: 'max_slots',
    columnName: 'max_slots',
    consume: (value: string) => Number(value)
  })
  public maxSlots: number;

  @column({ serializeAs: 'session_date', columnName: 'session_date' })
  public sessionDate: string

  @column({ serializeAs: 'start_time', columnName: 'start_time' })
  public startTime: string

  @column({ serializeAs: 'end_time', columnName: 'end_time' })
  public endTime: string

  @column({ serializeAs: 'status', columnName: 'status' })
  public status: string;

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
  public static setId(clinicSession: ClinicSession) {
    clinicSession.uuid = uuidv4()
  }
}
