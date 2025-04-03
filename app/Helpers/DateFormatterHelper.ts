import moment from 'moment-timezone'
import GeneralConstants from 'App/Constants/GeneralConstants'

export default class DateFormatterHelper {
  constructor() {}

  public static formatDate(date) {
    if (date) {
      return moment(date).tz(GeneralConstants.PH_TIMEZONE).format('MMM DD, YYYY hh:mm:ss A')
    }

    return null
  }

  public static getCurrentTimestamp() {
    return moment().tz(GeneralConstants.PH_TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
  }

  public static setExpiresAtTimestamp() {
    return moment().add(5, 'minutes').tz(GeneralConstants.PH_TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
  }

  public static getCurrentYear() {
    return moment().tz(GeneralConstants.PH_TIMEZONE).format('YYYY')
  }

  public static formatTimestamp(value) {
    let dateValue: any = null
    let timeValue: any = null

    if (value) {
      dateValue = moment(value).format('MMM DD, YYYY')
      timeValue = moment(value).format('hh:mm A')

      return dateValue + ' at ' + timeValue
    }

    return null
  }

  public static formatDateToHuman(date: string, time: string): string {
    return moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Asia/Manila').format('MMM DD, YYYY');
  }

  public static formatTimeTo12Hour(date: string, time: string): string {
    return moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Asia/Manila').format('hh:mm A');
  }
}
