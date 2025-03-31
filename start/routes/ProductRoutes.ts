import Route from '@ioc:Adonis/Core/Route'
import ProductController from 'App/Controllers/ProductController'

export const ProductRoutes = () => {
  Route.group(() => {
    Route.get('/', async (ctx) => { return new ProductController().index(ctx) })
    Route.get('/:id', async (ctx) => { return new ProductController().show(ctx) })
    Route.post('/', async (ctx) => { return new ProductController().store(ctx) })
    Route.put('/:id', async (ctx) => { return new ProductController().update(ctx) })
    Route.delete('/:id', async (ctx) => { return new ProductController().destroy(ctx) })
  }).prefix('products').middleware('auth:api')
}
