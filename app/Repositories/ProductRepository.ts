import CreateException from "App/Exceptions/CreateException";
import NotFoundException from "App/Exceptions/NotFoundException";
import DeleteException from "App/Exceptions/DeleteException";
import UpdateException from "App/Exceptions/UpdateException";
import Product from "App/Models/Product";

export default class ProductRepository {
  constructor() {}

  async getAll(filters: any) {
    let {
      q,
      sort_by: sortBy = 'id',
      sort_direction: sortDirection = 'desc',
    } = filters

    let queryModel = Product.query()

    if(q){
      queryModel
        .where('code', 'LIKE', '%' + q + '%')
        .orWhere('name', 'LIKE', '%' + q + '%')
    }

    return await queryModel
      .orderBy(sortBy, sortDirection)
      .paginate(filters.page, filters.limit)
  }

  async getById(uuid: string) {
    return Product.query()
      .where('uuid', uuid)
      .firstOrFail()
      .then((res) => {
        return res.serialize()
      }, (err) => {
        throw new NotFoundException('product', err.message)
      }
    )
  }

  async add(data){
    return await Product.create(data).then(
      (created) => {
        return created.serialize()
      },
      (err) => {
        throw new CreateException('product', err.message)
      }
    )
  }

  async update(uuid: string, dataToBeAdded) {
    return await Product.query().update(dataToBeAdded).where('uuid', uuid).then(
      (response) => {
        return response
      },
      (error) => {
        throw new UpdateException('product', error.message)
      }
    )
  }

  async delete(uuid: string) {
    return await Product.query().delete().where('uuid', uuid).then(
      (deleted) => {
        return deleted
      },
      (err) => {
        throw new DeleteException('product', err.message)
      }
    )
  }
}
