import GeneralConstants from 'App/Constants/GeneralConstants'
import moment from "moment-timezone";
import crypto from 'crypto'

export default class GeneralHelper {
  constructor() {}

  public static convertToBoolean(a) {
    let TRUTHY_VALUES = [true, 'true', 1, '1']

    return TRUTHY_VALUES.some(function (t) {
      return t === a
    })
  }

  public static generateAccessTokenLabel(roleType: string) {
    switch (roleType) {
      case GeneralConstants.ROLE_TYPES.STAFF:
        return 'Staff Access Token'
      case GeneralConstants.ROLE_TYPES.CUSTOMER:
        return 'Customer Access Token'
      default:
        return 'Admin Access Token'
    }
  }

  public static removeDuplicates(data: []) {
    return [...new Set(data)]
  }

  public static getTokenBasedOnAuth(authHeader: string | undefined): string {
    return authHeader ? authHeader.split('Bearer ')[1] : ''
  }

  public static formatMobileNumber(mobile: string): string | null {
    // Remove non-numeric characters from the mobile number
    const numericMobile = mobile.replace(/\D/g, '')

    // Check if the numericMobile has a valid length
    if (numericMobile.length !== 10) {
      return null // Invalid mobile number length
    }

    const formattedMobile = `63${numericMobile}`

    return formattedMobile
  }

  public static generateRefNo(prefix: string, autoId: number){
    const idWithLeftPaddedZero = autoId.toString().padStart(6, '0');
    const currentDate = moment().tz(GeneralConstants.PH_TIMEZONE).format('YYYYMMDD');
    return `${prefix}-${currentDate}-${idWithLeftPaddedZero}`;
  }

  public static generateClinicSessionRefNo(){
    const hash = crypto.randomBytes(4).toString('hex')
    return hash;
  }

  public static parseJsonOrArray(data: any): any[] {
    if (Array.isArray(data)) {
      return data;
    }

    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('JSON parse error:', error.message);
        return [];
      }
    }

    return [];
  }
}
