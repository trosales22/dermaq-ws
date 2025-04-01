import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClinicSession from 'App/Models/ClinicSession';
import GeneralConstants from 'App/Constants/GeneralConstants';

export default class UpdateClinicSessionRequest {
  private sessionDateFormat: string = 'yyyy-MM-dd'
  private startEndTimeFormat: string = 'HH:mm'

  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({escape: true, trim: true}, [
        rules.exists({table: ClinicSession.table, column: 'uuid'})
      ])
    }),
    title: schema.string.optional({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    description: schema.string.optional({ trim: true, escape: true }, [
      rules.maxLength(200)
    ]),
    session_date: schema.date.optional({format: this.sessionDateFormat}),
    start_time: schema.date.optional({format: this.startEndTimeFormat}),
    end_time: schema.date.optional({format: this.startEndTimeFormat}),
    max_slots: schema.number.optional(),
    status: schema.enum.optional([
      GeneralConstants.CLINIC_SESSION_STATUS_CODES.OPEN,
      GeneralConstants.CLINIC_SESSION_STATUS_CODES.CLOSED,
      GeneralConstants.CLINIC_SESSION_STATUS_CODES.CANCELLED
    ] as const)
  })

  public messages = {
    'params.id.required': 'Clinic Session ID is required',
    'params.id.exists': 'Clinic Session ID does not exist',
    'title.maxLength': 'Title should not exceed 50 characters',
    'description.maxLength': 'Description should not exceed 200 characters',
    'session_date.date.format': 'Session Date must be formatted as ' + this.sessionDateFormat,
    'start_time.date.format': 'Start Time must be formatted as ' + this.startEndTimeFormat,
    'end_time.date.format': 'End Time must be formatted as ' + this.startEndTimeFormat,
    'max_slots.number': 'Max Slots must be a number',
    'status.enum': 'Status must be in {{ options.choices }}'
  }
}
