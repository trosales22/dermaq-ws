import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/AuthController'
import { ProductRoutes } from './ProductRoutes'
import { ClinicSessionRoutes } from './ClinicSessionRoutes'
import { ReservationRoutes } from './ReservationRoutes'
import { DashboardRoutes } from './DashboardRoutes'
import { StaffMgmtRoutes } from './StaffMgmtRoutes'
import { OrderRoutes } from './OrderRoutes'
import { DatasetsRoutes } from './DatasetsRoutes'

export const CoreRoutes = () => [
  Route.group(() => {
    Route.post('login', async (ctx) => {return new AuthController().login(ctx)})
    Route.post('logout', async (ctx) => {return new AuthController().logout(ctx)}).middleware('auth:api')
    Route.put('change_password', async (ctx) => {return new AuthController().changePassword(ctx)}).middleware('auth:api')
    Route.get('my_profile', async (ctx) => { return new AuthController().myProfile(ctx)}).middleware(['auth:api', 'admin'])
    Route.put('my_profile', async (ctx) => { return new AuthController().updateProfile(ctx)}).middleware(['auth:api', 'admin'])

    DashboardRoutes()
    ClinicSessionRoutes()
    ReservationRoutes()
    ProductRoutes()
    OrderRoutes()
    StaffMgmtRoutes()
    DatasetsRoutes()
  }).prefix('core')
]
