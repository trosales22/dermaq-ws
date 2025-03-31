import CreateException from "App/Exceptions/CreateException";
import UpdateException from "App/Exceptions/UpdateException";
import User from "App/Models/User";

export default class UserRepository {
  constructor() {}

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
}
