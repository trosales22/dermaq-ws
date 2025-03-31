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

  public static GENERAL_STATUS_TYPES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
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

  public static CURRENCY_TYPES = {
    PHP: 'PHP',
    USD: 'USD'
  }

  public static VEHICLE_TRANSMISSION_TYPES = {
    AUTOMATIC: 'automatic',
    MANUAL: 'manual'
  }

  public static VEHICLE_TRANSMISSION_LABELS = {
    [this.VEHICLE_TRANSMISSION_TYPES.AUTOMATIC]: 'Automatic',
    [this.VEHICLE_TRANSMISSION_TYPES.MANUAL]: 'Manual'
  };

  public static VEHICLE_FUEL_TYPES = {
    PETROL: 'petrol',
    DIESEL: 'diesel',
    ELECTRIC: 'electric',
    HYBDRID: 'hybrid'
  }

  public static VEHICLE_FUEL_LABELS = {
    [this.VEHICLE_FUEL_TYPES.PETROL]: 'Petrol',
    [this.VEHICLE_FUEL_TYPES.DIESEL]: 'Diesel',
    [this.VEHICLE_FUEL_TYPES.ELECTRIC]: 'Electric',
    [this.VEHICLE_FUEL_TYPES.HYBDRID]: 'Hybrid'
  }

  public static VEHICLE_TYPES = {
    SEDAN: 'sedan',
    SUV: 'suv',
    MPV: 'mpv',
    VAN: 'van',
    HATCHBACK: 'hatchback',
    PICKUP: 'pickup'
  }

  public static VEHICLE_TYPE_LABELS = {
    [this.VEHICLE_TYPES.SEDAN]: 'Sedan',
    [this.VEHICLE_TYPES.SUV]: 'SUV',
    [this.VEHICLE_TYPES.MPV]: 'MPV',
    [this.VEHICLE_TYPES.VAN]: 'Van',
    [this.VEHICLE_TYPES.HATCHBACK]: 'Hatchback',
    [this.VEHICLE_TYPES.PICKUP]: 'Pickup'
  }

  public static VEHICLE_STATUSES = {
    AVAILABLE: 'available',
    RENTED: 'rented',
    MAINTENANCE: 'maintenance'
  }

  public static VEHICLE_STATUS_LABELS = {
    [this.VEHICLE_STATUSES.AVAILABLE]: 'Available',
    [this.VEHICLE_STATUSES.RENTED]: 'Rented',
    [this.VEHICLE_STATUSES.MAINTENANCE]: 'Maintenance'
  }

  public static BOOKING_STATUS_CODES = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
    CANCELLED: 'cancelled'
  }

  public static BOOKING_STATUS_LABELS = {
    [this.BOOKING_STATUS_CODES.PENDING]: 'Pending',
    [this.BOOKING_STATUS_CODES.ACCEPTED]: 'Accepted',
    [this.BOOKING_STATUS_CODES.DECLINED]: 'Declined',
    [this.BOOKING_STATUS_CODES.CANCELLED]: 'Cancelled'
  }

  public static SUPPORT_TICKET_CATEGORIES = {
    GENERAL: 'general',
    BILLING: 'billing',
    TECHNICAL: 'technical',
    CANCELLATION: 'cancellation'
  }

  public static SUPPORT_TICKET_STATUS_CODES = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
  }

  public static BOOKING_PREFIX = 'AUT'

  public static VEHICLE_LIST_SORT_TYPES = {
    PRICE: 'price',
    BRAND: 'brand',
    MODEL: 'model'
  }

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
