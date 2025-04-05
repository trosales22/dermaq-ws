import { TransformerAbstract } from '@ioc:Adonis/Addons/Bumblebee'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'

export default class OrderTransformer extends TransformerAbstract {
  public async transform(model: any) {
    const customer = model.customer
    const asisstant = model.assistant
    const orderedProducts = model.products

    let customerArr: any = null
    let assistantArr: any = null

    if(customer){
      customerArr = {
        id: customer.uuid,
        email: customer.email,
        fullname: customer.firstname + ' ' + customer.lastname,
        mobile: customer.mobile,
        photo_url: customer.photo_url
      }
    }

    if(asisstant){
      assistantArr = {
        id: asisstant.uuid,
        email: asisstant.email,
        fullname: asisstant.firstname + ' ' + asisstant.lastname,
        mobile: asisstant.mobile,
        photo_url: asisstant.photo_url
      }
    }

    return {
      id: model.uuid,
      refno: model.refno,
      customer: customerArr,
      assistant: assistantArr,
      orders: orderedProducts.map((orderedProduct) => {
        const productData = orderedProduct?.product
        let productArr: any = null

        if(productData){
          productArr = {
            id: productData.uuid,
            name: productData.name,
            description: productData.description,
            photo_url: productData.photo_url,
            price: productData.price
          }
        }
        return {
          product: productArr,
          quantity: orderedProduct.quantity
        }
      }),
      total_amount: model.total_amount,
      created_at: DateFormatterHelper.formatDate(model.created_at),
      updated_at: DateFormatterHelper.formatDate(model.updated_at)
    }
  }
}
