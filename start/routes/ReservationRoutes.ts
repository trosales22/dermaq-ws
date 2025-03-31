import Route from '@ioc:Adonis/Core/Route'
import ReservationController from 'App/Controllers/ReservationController'

export const ReservationRoutes = () => {
  Route.group(() => {
    Route.get('/', async (ctx) => { return new ReservationController().index(ctx) })
  }).prefix('reservations').middleware('auth:api')
}
