import Route from '@ioc:Adonis/Core/Route'
import ClinicSessionController from 'App/Controllers/ClinicSessionController'

export const ClinicSessionRoutes = () => {
  Route.group(() => {
    Route.get('/', async (ctx) => { return new ClinicSessionController().index(ctx) })
    Route.get('/:id', async (ctx) => { return new ClinicSessionController().show(ctx) })
    Route.post('/', async (ctx) => { return new ClinicSessionController().store(ctx) })
    Route.put('/:id', async (ctx) => { return new ClinicSessionController().update(ctx) })
    Route.delete('/:id', async (ctx) => { return new ClinicSessionController().destroy(ctx) })
  }).prefix('clinic_sessions').middleware('auth:api')
}
