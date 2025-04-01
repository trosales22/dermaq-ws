import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import LoginValidator from 'App/Validators/LoginValidator'
import GeneralHelper from 'App/Helpers/GeneralHelper'
import GeneralConstants from 'App/Constants/GeneralConstants'

export default class CustomerController {
  public async login({ request, auth, response }: HttpContextContract) {
    await request.validate(LoginValidator)

    const { user_id, password } = request.only(['user_id', 'password'])
    const userData = await User.query()
      .where('profile_type', GeneralConstants.ROLE_TYPES.CUSTOMER)
      .where('email', user_id)
      .orWhere('username', user_id)
      .first()

    if(!userData){
      return response.badRequest({ code: 400, message: 'User not found.' })
    }

    const userProfileType: string = userData.profileType

    if(userData.status !== GeneralConstants.GENERAL_STATUS_TYPES['ACTIVE']){
      return response.badRequest({ code: 400, message: 'Inactive account. Please contact administrator for assistance.' })
    }

    if (!(await Hash.verify(userData.password, password))) {
      return response.status(401).json({ code: 401, message: 'Invalid credentials.' })
    }

    const accessToken = await auth.use('api').generate(userData, {
      name: GeneralHelper.generateAccessTokenLabel(userProfileType),
      expiresIn: GeneralConstants.SESSION_EXPIRY,
    })

    return response.json({
      message: 'User logged in successfully.',
      is_2fa_enabled: userData.is2faEnabled,
      access_token: accessToken,
      details: {
        email: userData.email,
        username: userData.username,
        firstname: userData.firstName,
        lastname: userData.lastName,
        phone_number: userData.mobile,
        role: userProfileType
      },
    })
  }
}
