import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import LoginValidator from 'App/Validators/LoginValidator'
import GeneralHelper from 'App/Helpers/GeneralHelper'
import GeneralConstants from 'App/Constants/GeneralConstants'
import UserRepository from 'App/Repositories/UserRepository'
import CreateCustomerRequest from 'App/Validators/Customer/CreateCustomerRequest'
import ReserveSlotRequest from 'App/Validators/Customer/ReserveSlotRequest'
import ReservationRepository from 'App/Repositories/ReservationRepository'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'
import ClinicSessionRepository from 'App/Repositories/ClinicSessionRepository'
import Reservation from 'App/Models/Reservation'
import FirebaseHelper from 'App/Helpers/FirebaseHelper'

export default class CustomerController {
  private userRepo: UserRepository
  private reservationRepo: ReservationRepository
  private clinicSessionRepo: ClinicSessionRepository

  constructor() {
    this.userRepo = new UserRepository()
    this.reservationRepo = new ReservationRepository()
    this.clinicSessionRepo = new ClinicSessionRepository()
  }

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

  // @ts-ignore
  public async store({ auth, request, response, transform }: HttpContextContract) {
    await request.validate(CreateCustomerRequest)

    let userPayload = request.only(['username', 'email', 'firstname', 'lastname', 'password'])
    userPayload['profile_type'] = GeneralConstants.ROLE_TYPES.CUSTOMER
    userPayload['status'] = GeneralConstants.GENERAL_STATUS_TYPES.ACTIVE

    const created = await this.userRepo.add(userPayload)
    const userData = await User.query().where('email', created.email).orWhere('username', created.username).firstOrFail()

    const accessToken = await auth.use('api').generate(userData, {
      name: GeneralHelper.generateAccessTokenLabel(created.profile_type),
      expiresIn: GeneralConstants.SESSION_EXPIRY
    })

    return response.created({
      message: 'User was successfully registered.',
      access_token: accessToken,
      details: {
        email: userData.email,
        username: userData.username,
        firstname: userData.firstName,
        lastname: userData.lastName,
        phone_number: userData.mobile,
        role: userData.profileType
      }
    })
  }

  public async reserveSlot({auth, request, response}: HttpContextContract){
    await request.validate(ReserveSlotRequest)

    const userAuthData = auth.use('api').user!
    const authUserUuid = userAuthData.uuid
    const authFullname = `${userAuthData?.firstName} ${userAuthData?.lastName}`
    const payload = request.only(['clinic_session_id'])
    const clinicSessionId: string = payload.clinic_session_id

    const clinicSessionData = await this.clinicSessionRepo.getById(clinicSessionId)
    const clinicSessionRefNo = clinicSessionData?.refno
    const sessionDate = clinicSessionData?.session_date
    const startTime = clinicSessionData?.start_time
    const endTime = clinicSessionData?.end_time

    const reservationCount: number = await this.reservationRepo.getCountByParams(clinicSessionId, authUserUuid)

    if(reservationCount >= 5){
      return response.badRequest({
        code: 400,
        message: `You have already made 5 reservations for this session. You cannot make more reservations. Please check your existing reservations or choose another session.`
      })
    }

    const reservedCount = await this.reservationRepo.getCountByClinicSessionId(clinicSessionId)

    if(reservedCount >= clinicSessionData.max_slots){
      return response.badRequest({
        code: 400,
        message: `The clinic session is fully booked. There are no available slots left. Please try another session or wait for availability.`
      })
    }

    const lastReservation = await Reservation.query()
      .where('clinic_session_id', clinicSessionId)
      .orderBy('queue_number', 'desc')
      .first()

    const nextQueueNumber = lastReservation ? lastReservation.queueNumber + 1 : 1;

    const createdReservation = await this.reservationRepo.add({
      clinic_session_id: clinicSessionId,
      customer_id: authUserUuid,
      status: GeneralConstants.RESERVATION_STATUS_CODES.CONFIRMED,
      queue_number: nextQueueNumber
    })

    const refno = GeneralHelper.generateRefNo(GeneralConstants.RESERVATION_PREFIX, createdReservation.id)

    await this.reservationRepo.update(createdReservation.uuid, {
      refno: refno,
      updated_at: DateFormatterHelper.getCurrentTimestamp()
    })

    await FirebaseHelper.saveQueueNumber({
      reservation_refno: refno,
      cs_refno: clinicSessionRefNo,
      queue_no: String(nextQueueNumber),
      customer_id: authUserUuid,
      customer_name: authFullname,
      status: GeneralConstants.RESERVATION_STATUS_CODES.CONFIRMED
    })

    return response.json({
      message: 'Successfully reserved a slot.',
      details: {
        refno: refno,
        queue_number: nextQueueNumber,
        title: clinicSessionData?.title,
        description: clinicSessionData?.description,
        session_date: sessionDate,
        start_time: startTime,
        end_time: endTime,
        formatted_start_time: DateFormatterHelper.formatTimeTo12Hour(sessionDate, startTime),
        formatted_end_time: DateFormatterHelper.formatTimeTo12Hour(sessionDate, endTime)
      }
    })
  }
}
