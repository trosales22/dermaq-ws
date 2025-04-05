import CreateException from "App/Exceptions/CreateException";
import NotFoundException from "App/Exceptions/NotFoundException";
import DeleteException from "App/Exceptions/DeleteException";
import UpdateException from "App/Exceptions/UpdateException";
import Order from "App/Models/Order";

export default class OrderRepository {
  constructor() {}

  async getAll(filters: any) {
    let {
      q,
      sort_by: sortBy = 'id',
      sort_direction: sortDirection = 'desc',
    } = filters

    let queryModel = Order.query()
      .preload('customer')
      .preload('assistant')
      .preload('products', (orderProductsQuery) => {
        orderProductsQuery.preload('product')
      })

    if(q){
      queryModel
        .where('refno', 'LIKE', `%${q}%`)
    }

    return await queryModel
      .orderBy(sortBy, sortDirection)
      .paginate(filters.page, filters.limit)
  }

  async getById(uuid: string) {
    return Order.query()
      .preload('customer')
      .preload('assistant')
      .preload('products', (orderProductsQuery) => {
        orderProductsQuery.preload('product')
      })
      .where('uuid', uuid)
      .firstOrFail()
      .then((res) => {
        return res.serialize()
      }, (err) => {
        throw new NotFoundException('order', err.message)
      }
    )
  }

  async add(data){
    return await Order.create(data).then(
      (created) => {
        return created.serialize()
      },
      (err) => {
        throw new CreateException('order', err.message)
      }
    )
  }

  async update(uuid: string, dataToBeAdded) {
    return await Order.query().update(dataToBeAdded).where('uuid', uuid).then(
      (response) => {
        return response
      },
      (error) => {
        throw new UpdateException('order', error.message)
      }
    )
  }

  async delete(uuid: string) {
    return await Order.query().delete().where('uuid', uuid).then(
      (deleted) => {
        return deleted
      },
      (err) => {
        throw new DeleteException('order', err.message)
      }
    )
  }
}
