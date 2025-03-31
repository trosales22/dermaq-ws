import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/AuthController'

export const CustomerRoutes = () => [
  Route.group(() => {
    Route.post('login', async (ctx) => {return new AuthController().login(ctx)})
    Route.post('logout', async (ctx) => {return new AuthController().logout(ctx)}).middleware(['auth:api', 'customer'])
    Route.get('my_profile', async (ctx) => { return new AuthController().myProfile(ctx)}).middleware(['auth:api', 'customer'])
    Route.put('my_profile', async (ctx) => { return new AuthController().updateProfile(ctx)}).middleware(['auth:api', 'customer'])
  }).prefix('customers')
]
