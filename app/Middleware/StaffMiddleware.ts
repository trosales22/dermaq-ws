import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GeneralConstants from 'App/Constants/GeneralConstants'

export default class StaffMiddleware {
  constructor(){
  }

  public async handle ({auth, response}: HttpContextContract, next: () => Promise<void>) {
    const userAuthData = auth.use('api').user!
    const authUserProfileType = userAuthData.profileType

    if(authUserProfileType !== GeneralConstants.ROLE_TYPES.STAFF){
      return response.badRequest({
        code: 400,
        message: 'Permission denied'
      })
    }

    await next()
  }
}
