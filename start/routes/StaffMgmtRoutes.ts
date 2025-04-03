import Route from '@ioc:Adonis/Core/Route'
import StaffMgmtController from 'App/Controllers/StaffMgmtController'

export const StaffMgmtRoutes = () => {
  Route.group(() => {
    Route.get('/', async (ctx) => { return new StaffMgmtController().index(ctx) })
    Route.get('/:id', async (ctx) => { return new StaffMgmtController().show(ctx) })
    Route.post('/', async (ctx) => { return new StaffMgmtController().store(ctx) })
    Route.put('/:id', async (ctx) => { return new StaffMgmtController().update(ctx) })
    Route.delete('/:id', async (ctx) => { return new StaffMgmtController().destroy(ctx) })
  }).prefix('staff').middleware(['auth:api', 'admin'])
}
