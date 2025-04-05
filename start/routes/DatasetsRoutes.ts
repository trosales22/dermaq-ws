import Route from '@ioc:Adonis/Core/Route'
import DatasetController from 'App/Controllers/DatasetController'

export const DatasetsRoutes = () => {
  Route.group(() => {
    Route.get('customers', async (ctx) => { return new DatasetController().customerIndex(ctx) })
    Route.get('products', async (ctx) => { return new DatasetController().productIndex(ctx) })
  }).prefix('datasets').middleware('auth:api')
}
