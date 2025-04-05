import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import LoginValidator from 'App/Validators/LoginValidator'
import GeneralHelper from 'App/Helpers/GeneralHelper'
import GeneralConstants from 'App/Constants/GeneralConstants'
import ChangePasswordRequest from 'App/Validators/ChangePasswordRequest'
import UpdateProfileRequest from 'App/Validators/UpdateProfileRequest'
import UserRepository from 'App/Repositories/UserRepository'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'

export default class AuthController {
  private userRepo: UserRepository

  constructor() {
    this.userRepo = new UserRepository()
  }

  public async login({ request, auth, response }: HttpContextContract) {
    await request.validate(LoginValidator)

    const { user_id, password } = request.only(['user_id', 'password'])
    const userData = await User.query()
      .whereIn('profile_type', [GeneralConstants.ROLE_TYPES.ADMIN, GeneralConstants.ROLE_TYPES.STAFF])
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

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()
    return response.json({ code: 200, message: 'Successfully logout' })
  }

  public async changePassword({ request, auth, response }: HttpContextContract) {
    await request.validate(ChangePasswordRequest)

    const user = auth.user!
    const payload = request.only(['old_password', 'new_password'])

    if (!(await user.verifyPassword(payload.old_password))) {
      return response.badRequest({ code: 400, message: 'Invalid old password' })
    }

    const newPassword = await Hash.make(payload.new_password)

    await this.userRepo.update(user.uuid, {
      password: newPassword,
      updated_at: DateFormatterHelper.getCurrentTimestamp()
    })

    return response.json({
      code: 200,
      message: 'Password changed successfully.'
    })
  }

  public async myProfile({auth, response}: HttpContextContract){
    const userAuthData = auth.use('api').user!

    return response.json({
      'data': {
        'username': userAuthData?.username,
        'email': userAuthData?.email,
        'mobile': userAuthData?.mobile,
        'firstname': userAuthData?.firstName,
        'lastname': userAuthData?.lastName,
        'photo_url': userAuthData?.photoUrl
      }
    })
  }

  public async updateProfile({ request, auth, response }: HttpContextContract) {
    await request.validate(UpdateProfileRequest)

    const userAuthData = auth.use('api').user!
    const authUserUuid = userAuthData.uuid
    const payload = request.only(['username', 'email', 'mobile', 'firstname', 'lastname'])

    await this.userRepo.update(authUserUuid, payload)

    return response.json({
      code: 200,
      message: 'Profile updated successfully.'
    })
  }
}
