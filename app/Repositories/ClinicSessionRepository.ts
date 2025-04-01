import CreateException from "App/Exceptions/CreateException";
import NotFoundException from "App/Exceptions/NotFoundException";
import DeleteException from "App/Exceptions/DeleteException";
import UpdateException from "App/Exceptions/UpdateException";
import ClinicSession from "App/Models/ClinicSession";

export default class ClinicSessionRepository {
  constructor() {}

  async getAll(filters: any) {
    let {
      q,
      sort_by: sortBy = 'id',
      sort_direction: sortDirection = 'desc',
    } = filters

    let queryModel = ClinicSession.query()

    if(q){
      queryModel
        .where('refno', 'LIKE', '%' + q + '%')
    }

    return await queryModel
      .orderBy(sortBy, sortDirection)
      .paginate(filters.page, filters.limit)
  }

  async getById(uuid: string) {
    return ClinicSession.query()
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
    return ClinicSession.query()
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
}
