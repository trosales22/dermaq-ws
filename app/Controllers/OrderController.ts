import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JSONSerializerHelper from 'App/Helpers/JSONSerializerHelper'
import OrderRepository from 'App/Repositories/OrderRepository'
import OrderTransformer from 'App/Transformers/OrderTransformer'
import Order from 'App/Models/Order'
import ListOrderRequest from 'App/Validators/Orders/ListOrderRequest'
import ViewOrderRequest from 'App/Validators/Orders/ViewOrderRequest'
import DeleteOrderRequest from 'App/Validators/Orders/DeleteOrderRequest'
import CreateOrderRequest from 'App/Validators/Orders/CreateOrderRequest'
import OrderProductRepository from 'App/Repositories/OrderProductRepository'
import GeneralHelper from 'App/Helpers/GeneralHelper'
import GeneralConstants from 'App/Constants/GeneralConstants'
import Product from 'App/Models/Product'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'

export default class OrderController {
  private orderRepo: OrderRepository
  private orderProductRepo: OrderProductRepository

  constructor() {
    this.orderRepo = new OrderRepository()
    this.orderProductRepo = new OrderProductRepository()
  }

  // @ts-ignore
  public async index({ params, request, response, transform }: HttpContextContract) {
    await request.validate(ListOrderRequest)

    const list = await this.orderRepo.getAll({
      q: request.input('q', null),
      page: request.input('page', 1),
      limit: request.input('limit', 25)
    })

    const serializedList = list.serialize()
    const transformed = await transform.collection(serializedList.data, OrderTransformer)
    const serialized = JSONSerializerHelper.serialize(Order.table, serializedList.meta, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async show({ params, request, response, transform }: HttpContextContract) {
    await request.validate(ViewOrderRequest)

    const data = await this.orderRepo.getById(params.id)
    const transformed = await transform.item(data, OrderTransformer)
    const serialized = JSONSerializerHelper.serialize(Order.table, null, transformed)

    return response.json(serialized)
  }

  // @ts-ignore
  public async store({ auth, params, request, response, transform }: HttpContextContract) {
    await request.validate(CreateOrderRequest)

    const userAuthData = auth.use('api').user!
    const authUserUuid = userAuthData.uuid

    const orders: {product_id: string; quantity: number;}[] = request.input('orders') ?? []

    const productIds = orders.map((order) => order.product_id)
    const products = await Product.query().whereIn('uuid', productIds)
    const productMap = products.reduce((acc, product) => {
      acc[product.uuid] = product
      return acc
    }, {} as Record<string, Product>)

    const totalAmount = orders.reduce((sum, order) => {
      const product = productMap[order.product_id]
      if (product) {
        sum += product.price * order.quantity
      }
      return sum
    }, 0)

    const created = await this.orderRepo.add({
      customer_id: request.input('customer_id'),
      total_amount: totalAmount,
      assisted_by_id: authUserUuid
    })

    //deduct quantity in products
    for (const order of orders) {
      const product = productMap[order.product_id]
      if (product) {
        product.quantity = product.quantity - order.quantity

        if (product.quantity < 0) {
          product.quantity = 0
        }

        await product.save()
      }
    }

    const orderUuid = created.uuid

    await this.orderRepo.update(orderUuid, {
      refno: GeneralHelper.generateRefNo(GeneralConstants.ORDERS_PREFIX, created.id),
      updated_at: DateFormatterHelper.getCurrentTimestamp()
    })

    const orderProductsArr = orders.map(order => ({
      order_id: orderUuid,
      product_id: order.product_id,
      quantity: order.quantity
    }))

    await this.orderProductRepo.addMany(orderProductsArr)

    const data = await this.orderRepo.getById(orderUuid)
    const transformed = await transform.item(data, OrderTransformer)
    const serialized = JSONSerializerHelper.serialize(Order.table, null, transformed)

    return response.created(serialized)
  }

  public async destroy({ params, request, response }: HttpContextContract) {
    await request.validate(DeleteOrderRequest)

    const orderId = params.id

    await this.orderProductRepo.deleteByOrderId(orderId)
    await this.orderRepo.delete(orderId)

    return response.status(204).json(null)
  }
}
