import Route from '@ioc:Adonis/Core/Route'
import DashboardController from 'App/Controllers/DashboardController'

export const DashboardRoutes = () => [
  Route.group(() => {
    Route.group(() => {
      Route.get('totals', async (ctx) => { return new DashboardController().statistics(ctx)})
    }).prefix('statistics')

    Route.group(() => {
      Route.get('monthly_reservation_stats', async (ctx) => { return new DashboardController().monthlyReservationStats(ctx)})
      Route.get('reservation_count_per_session', async (ctx) => { return new DashboardController().reservationCountPerSession(ctx)})
    }).prefix('analytics')
  }).prefix('dashboard').middleware(['auth:api'])
]
