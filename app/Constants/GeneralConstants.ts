export default class GeneralConstants {
  public static PH_TIMEZONE = 'Asia/Manila'
  public static SESSION_EXPIRY = '480mins' //8hrs

  public static ENVIRONMENT_TYPES = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
  }

  public static ROLE_TYPES = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    CUSTOMER: 'CUSTOMER'
  }

  public static ROLE_LABELS = {
    [this.ROLE_TYPES.ADMIN]: 'Administrator',
    [this.ROLE_TYPES.STAFF]: 'Staff',
    [this.ROLE_TYPES.CUSTOMER]: 'Customer',
  }

  public static GENERAL_STATUS_TYPES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  }

  public static GENERAL_STATUS_LABELS = {
    [this.GENERAL_STATUS_TYPES.ACTIVE]: 'Active',
    [this.GENERAL_STATUS_TYPES.INACTIVE]: 'Inactive',
  }

  public static CLINIC_SESSION_STATUS_CODES = {
    OPEN: 'open',
    CLOSED: 'closed',
    CANCELLED: 'cancelled'
  }

  public static CLINIC_SESSION_STATUS_LABELS = {
    [this.CLINIC_SESSION_STATUS_CODES.OPEN]: 'Open',
    [this.CLINIC_SESSION_STATUS_CODES.CLOSED]: 'Closed',
    [this.CLINIC_SESSION_STATUS_CODES.CANCELLED]: 'Cancelled'
  }

  public static RESERVATION_STATUS_CODES = {
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    UNATTENDED: 'unattended'
  }

  public static RESERVATION_STATUS_LABELS = {
    [this.RESERVATION_STATUS_CODES.CONFIRMED]: 'Confirmed',
    [this.RESERVATION_STATUS_CODES.COMPLETED]: 'Completed',
    [this.RESERVATION_STATUS_CODES.CANCELLED]: 'Cancelled',
    [this.RESERVATION_STATUS_CODES.UNATTENDED]: 'Unattended'
  }

  public static RESERVATION_PREFIX = 'DERMAQ'

  public static MONTH_NAMES = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  }
}
