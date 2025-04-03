import CreateException from "App/Exceptions/CreateException";
import DeleteException from "App/Exceptions/DeleteException";
import NotFoundException from "App/Exceptions/NotFoundException";
import UpdateException from "App/Exceptions/UpdateException";
import User from "App/Models/User";

export default class UserRepository {
  constructor() {}

  async getAll(filters: any) {
    let {
      q,
      profile_type: profileType,
      status,
      sort_by: sortBy = 'id',
      sort_direction: sortDirection = 'desc',
    } = filters

    let queryModel = User.query()

    if(q){
      queryModel
        .where('username', 'LIKE', `%${q}%`)
        .orWhere('email', 'LIKE', `%${q}%`)
        .orWhere('firstname', 'LIKE', `%${q}%`)
        .orWhere('lastname', 'LIKE', `%${q}%`)
    }

    if(profileType){
      queryModel.where('profile_type', profileType)
    }

    if(status){
      queryModel.where('status', status)
    }

    return await queryModel
      .orderBy(sortBy, sortDirection)
      .paginate(filters.page, filters.limit)
  }

  async getById(uuid: string) {
    return User.query()
      .where('uuid', uuid)
      .firstOrFail()
      .then((res) => {
        return res.serialize()
      }, (err) => {
        throw new NotFoundException('user', err.message)
      }
    )
  }

  async add(data){
    return await User.create(data).then(
      (created) => {
        return created.serialize()
      },
      (err) => {
        throw new CreateException('user', err.message)
      }
    )
  }

  async update(uuid: string, dataToBeAdded) {
    return await User.query().update(dataToBeAdded).where('uuid', uuid).then(
      (response) => {
        return response
      },
      (error) => {
        throw new UpdateException('user', error.message)
      }
    )
  }

  async updateByBusinessId(businessId: string, dataToBeAdded) {
    return await User.query().update(dataToBeAdded).where('business_id', businessId).then(
      (response) => {
        return response
      },
      (error) => {
        throw new UpdateException('user', error.message)
      }
    )
  }

  isExistsByBusinessId(businessId: string) {
    return User.query()
      .where('business_id', businessId)
      .firstOrFail()
      .then(() => {
        return true
      }, () => {
        return false
      }
    )
  }

  async delete(uuid: string) {
    return await User.query().delete().where('uuid', uuid).then(
      (deleted) => {
        return deleted
      },
      (err) => {
        throw new DeleteException('user', err.message)
      }
    )
  }
}
