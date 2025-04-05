import Route from '@ioc:Adonis/Core/Route'
import OrderController from 'App/Controllers/OrderController'

export const OrderRoutes = () => {
  Route.group(() => {
    Route.get('/', async (ctx) => { return new OrderController().index(ctx) })
    Route.get('/:id', async (ctx) => { return new OrderController().show(ctx) })
    Route.post('/', async (ctx) => { return new OrderController().store(ctx) })
    Route.delete('/:id', async (ctx) => { return new OrderController().destroy(ctx) })
  }).prefix('orders').middleware(['auth:api'])
}
