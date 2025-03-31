import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { v4 as uuidv4 } from 'uuid'
import { column, beforeSave, BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import GeneralConstants from 'App/Constants/GeneralConstants'

export default class User extends BaseModel {
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
  public uuid: string

  @column({ serializeAs: 'username', columnName: 'username' })
  public username: string

  @column({ serializeAs: 'email', columnName: 'email' })
  public email: string

  @column({ serializeAs: 'mobile', columnName: 'mobile' })
  public mobile: string

  @column({ serializeAs: 'firstname', columnName: 'firstname' })
  public firstName: string

  @column({ serializeAs: 'lastname', columnName: 'lastname' })
  public lastName: string

  @column({ serializeAs: 'photo_url', columnName: 'photo_url' })
  public photoUrl: string

  @column({ serializeAs: null, columnName: 'password' })
  public password: string

  @column({ serializeAs: 'profile_type', columnName: 'profile_type' })
  public profileType: string

  @column({ serializeAs: 'status', columnName: 'status' })
  public status: string

  @column()
  public resetToken: string | null

  @column({
    serialize: (value?: Number) => {
      return Boolean(value)
    },
    serializeAs: 'is_2fa_enabled',
    columnName: 'is_2fa_enabled',
  })
  public is2faEnabled: boolean

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
  public static setId(user: User) {
    user.uuid = uuidv4()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public async verifyPassword(plainPassword: string): Promise<boolean> {
    return await Hash.verify(this.password, plainPassword)
  }
}
