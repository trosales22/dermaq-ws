import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/AuthController'
import CustomerController from 'App/Controllers/CustomerController'

export const CustomerRoutes = () => [
  Route.group(() => {
    Route.post('login', async (ctx) => {return new CustomerController().login(ctx)})
    Route.post('logout', async (ctx) => {return new AuthController().logout(ctx)}).middleware(['auth:api', 'customer'])
    Route.post('/', async (ctx) => {return new CustomerController().store(ctx)})
    Route.get('my_profile', async (ctx) => { return new AuthController().myProfile(ctx)}).middleware(['auth:api', 'customer'])
    Route.put('my_profile', async (ctx) => { return new AuthController().updateProfile(ctx)}).middleware(['auth:api', 'customer'])

    Route.post('reserve_slot', async (ctx) => {return new CustomerController().reserveSlot(ctx)}).middleware(['auth:api', 'customer'])
  }).prefix('customers')
]
