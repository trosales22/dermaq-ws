import Route from '@ioc:Adonis/Core/Route'
import CustomerMgmtController from 'App/Controllers/CustomerMgmtController'

export const CustomerMgmtRoutes = () => {
  Route.group(() => {
    Route.get('/', async (ctx) => { return new CustomerMgmtController().index(ctx) })
    Route.get('/:id', async (ctx) => { return new CustomerMgmtController().show(ctx) })
  }).prefix('customers').middleware(['auth:api', 'admin'])
}
