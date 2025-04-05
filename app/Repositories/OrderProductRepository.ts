import CreateException from "App/Exceptions/CreateException";
import DeleteException from "App/Exceptions/DeleteException";
import OrderProduct from "App/Models/OrderProduct";

export default class OrderProductRepository {
  constructor() {
  }

  async addMany(data: any){
    return await OrderProduct.createMany(data).then(
      (created) => {
        return created
      },
      (err) => {
        throw new CreateException('order product', err.message)
      }
    )
  }

  async deleteByOrderId(orderId: string) {
    return await OrderProduct.query().delete().where('order_id', orderId).then(
      (created) => {
        return created
      },
      (err) => {
        throw new DeleteException('order product', err.message)
      }
    )
  }
}
