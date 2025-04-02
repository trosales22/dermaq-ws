import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClinicSession from 'App/Models/ClinicSession';
import GeneralConstants from 'App/Constants/GeneralConstants';
import Reservation from 'App/Models/Reservation';

export default class UpdateReservationRequest {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({escape: true, trim: true}, [
        rules.exists({table: ClinicSession.table, column: 'uuid'})
      ]),
      refno: schema.string({escape: true, trim: true}, [
        rules.exists({
          table: Reservation.table,
          column: 'refno',
          where: {
            clinic_session_id: this.ctx.params.id
          }
        })
      ])
    }),
    status: schema.enum([
      GeneralConstants.RESERVATION_STATUS_CODES.UNATTENDED,
      GeneralConstants.RESERVATION_STATUS_CODES.COMPLETED
    ] as const)
  })

  public messages = {
    'params.id.required': 'Clinic Session ID is required',
    'params.id.exists': 'Clinic Session ID does not exist',
    'params.refno.required': 'Reference Number is required',
    'params.refno.exists': 'Reference Number does not exist',
    'status.required': 'Reservation Status is required',
    'status.enum': 'Reservation Status must be in {{ options.choices }}'
  }
}
