import CreateException from "App/Exceptions/CreateException";
import NotFoundException from "App/Exceptions/NotFoundException";
import DeleteException from "App/Exceptions/DeleteException";
import UpdateException from "App/Exceptions/UpdateException";
import ClinicSession from "App/Models/ClinicSession";
import moment from "moment";
import GeneralConstants from "App/Constants/GeneralConstants";
import FirebaseHelper from "App/Helpers/FirebaseHelper";

export default class ClinicSessionRepository {
  constructor() {}

  async getAll(filters: any) {
    let {
      q,
      sort_by: sortBy = 'id',
      sort_direction: sortDirection = 'desc',
      status
    } = filters

    let queryModel = ClinicSession.query().preload('reservations')

    if(q){
      queryModel
        .where('refno', 'LIKE', `%${q}%`)
        .orWhere('title', 'LIKE', `%${q}%`)
    }

    if(status){
      queryModel.where('status', status)
    }

    return await queryModel
      .orderBy(sortBy, sortDirection)
      .paginate(filters.page, filters.limit)
  }

  async getById(uuid: string) {
    return ClinicSession.query().preload('reservations')
      .where('uuid', uuid)
      .firstOrFail()
      .then((res) => {
        return res.serialize()
      }, (err) => {
        throw new NotFoundException('clinic session', err.message)
      }
    )
  }

  async getByRefno(refno: string) {
    return ClinicSession.query().preload('reservations')
      .where('refno', refno)
      .firstOrFail()
      .then((res) => {
        return res.serialize()
      }, (err) => {
        throw new NotFoundException('clinic session', err.message)
      }
    )
  }

  async add(data){
    return await ClinicSession.create(data).then(
      (created) => {
        return created.serialize()
      },
      (err) => {
        throw new CreateException('clinic session', err.message)
      }
    )
  }

  async update(uuid: string, dataToBeAdded) {
    return await ClinicSession.query().update(dataToBeAdded).where('uuid', uuid).then(
      (response) => {
        return response
      },
      (error) => {
        throw new UpdateException('clinic session', error.message)
      }
    )
  }

  async delete(uuid: string) {
    return await ClinicSession.query().delete().where('uuid', uuid).then(
      (deleted) => {
        return deleted
      },
      (err) => {
        throw new DeleteException('clinic session', err.message)
      }
    )
  }

  async closeOutdatedSessions() {
    const today = moment().tz('Asia/Manila').format('YYYY-MM-DD')

    try {
      const sessionsToClose = await ClinicSession.query()
        .where('session_date', '<', today)
        .andWhere('status', '!=', GeneralConstants.CLINIC_SESSION_STATUS_CODES.CLOSED)

      for (const session of sessionsToClose) {
        // Remove Firebase queue node
        await FirebaseHelper.removeQueue(session.refno)

        // Update session status
        session.status = GeneralConstants.CLINIC_SESSION_STATUS_CODES.CLOSED
        await session.save()
      }

      return sessionsToClose.length
    } catch (error) {
      throw new UpdateException('clinic session', error.message)
    }
  }
}
