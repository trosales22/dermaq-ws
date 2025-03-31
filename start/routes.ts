import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'
import RouteNotFoundException from 'App/Exceptions/RouteNotFoundException'
import { CoreRoutes } from './routes/CoreRoutes'
import { CustomerRoutes } from './routes/CustomerRoutes'

//base url handling
Route.get('/', ({ response }) =>
  response.json({
    name: 'DermaQ API',
    environment: Env.get('NODE_ENV'),
    timezone: Env.get('TZ')
  })
)

Route.group(() => {
  CustomerRoutes()
  CoreRoutes()
}).prefix('api/v1')

//handle unknown routes
Route.any('*', (_) => {
  throw new RouteNotFoundException('Route not found.', 404)
})
