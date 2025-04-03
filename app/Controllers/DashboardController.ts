import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GeneralConstants from 'App/Constants/GeneralConstants'
import DateFormatterHelper from 'App/Helpers/DateFormatterHelper'
import AnalyticsRepository from 'App/Repositories/AnalyticsRepository'
import StatisticsRepository from 'App/Repositories/StatisticsRepository'

export default class DashboardController {
  private statisticsRepo: StatisticsRepository
  private analyticsRepo: AnalyticsRepository

  constructor() {
    this.statisticsRepo = new StatisticsRepository()
    this.analyticsRepo = new AnalyticsRepository()
  }

  public async statistics({response}: HttpContextContract){
    const statistics = await this.statisticsRepo.getOverallStats()
    return response.json(statistics[0][0])
  }

  public async monthlyReservationStats({request, response}: HttpContextContract){
    const analyticsRes = await this.analyticsRepo.getMonthlyReservationStats({
      'year': request.input('year', DateFormatterHelper.getCurrentYear())
    })

    let formattedAnalyticsRes = analyticsRes.map((dataItem: any) => {
      return {
        'month': GeneralConstants.MONTH_NAMES[dataItem.month],
        'confirmed_count': dataItem?.confirmed_count || 0,
        'completed_count': dataItem?.completed_count || 0,
        'unattended_count': dataItem?.unattended_count || 0
      }
    })

    return response.json({
      'data': formattedAnalyticsRes
    })
  }

  public async reservationCountPerSession({response}: HttpContextContract){
    const analyticsRes = await this.analyticsRepo.getReservationCountPerSession()

    let formattedAnalyticsRes = analyticsRes.map((dataItem: any) => {
      return {
        'key': dataItem?.session_title || 'Session',
        'value': dataItem?.reservation_count || 0
      }
    })

    return response.json({
      'data': formattedAnalyticsRes
    })
  }
}
