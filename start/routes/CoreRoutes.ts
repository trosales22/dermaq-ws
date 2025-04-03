import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/AuthController'
import { ProductRoutes } from './ProductRoutes'
import { ClinicSessionRoutes } from './ClinicSessionRoutes'
import { ReservationRoutes } from './ReservationRoutes'
import { DashboardRoutes } from './DashboardRoutes'

export const CoreRoutes = () => [
  Route.group(() => {
    Route.post('login', async (ctx) => {return new AuthController().login(ctx)})
    Route.post('logout', async (ctx) => {return new AuthController().logout(ctx)}).middleware('auth:api')
    Route.put('change_password', async (ctx) => {return new AuthController().changePassword(ctx)}).middleware('auth:api')

    DashboardRoutes()
    ClinicSessionRoutes()
    ReservationRoutes()
    ProductRoutes()
  }).prefix('core')
]
