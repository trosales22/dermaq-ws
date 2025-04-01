import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClinicSession from 'App/Models/ClinicSession'

export default class ReserveSlotRequest {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    clinic_session_id: schema.string({ trim: true, escape: true }, [
      rules.uuid({version: 4}),
      rules.exists({table: ClinicSession.table, column: 'uuid'})
    ])
  })

  public messages = {
    'clinic_session_id.required': 'Clinic Session ID is required',
    'clinic_session_id.uuid': 'Clinic Session ID must be a valid UUID',
    'clinic_session_id.exists': 'Clinic Session ID does not exist'
  }
}
