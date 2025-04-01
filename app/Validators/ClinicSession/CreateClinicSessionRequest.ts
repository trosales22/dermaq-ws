import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateClinicSessionRequest {
  private sessionDateFormat: string = 'yyyy-MM-dd'
  private startEndTimeFormat: string = 'HH:mm'

  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string({ trim: true, escape: true }, [
      rules.maxLength(50)
    ]),
    description: schema.string({ trim: true, escape: true }, [
      rules.maxLength(200)
    ]),
    session_date: schema.date({format: this.sessionDateFormat}),
    start_time: schema.date({format: this.startEndTimeFormat}),
    end_time: schema.date({format: this.startEndTimeFormat}),
    max_slots: schema.number()
  })

  public messages = {
    'title.required': 'Title is required',
    'title.maxLength': 'Title should not exceed 50 characters',
    'description.required': 'Description is required',
    'description.maxLength': 'Description should not exceed 200 characters',
    'session_date.required': 'Session Date is required',
    'session_date.date.format': 'Session Date must be formatted as ' + this.sessionDateFormat,
    'start_time.required': 'Start Time is required',
    'start_time.date.format': 'Start Time must be formatted as ' + this.startEndTimeFormat,
    'end_time.required': 'End Time is required',
    'end_time.date.format': 'End Time must be formatted as ' + this.startEndTimeFormat,
    'max_slots.required': 'Max Slots is required',
    'max_slots.number': 'Max Slots must be a number'
  }
}
