import { GuardsList } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'

export default class AuthMiddleware {
  protected redirectTo = '/login'

  protected async authenticate (auth: HttpContextContract['auth'], guards: (keyof GuardsList)[]) {
    for (let guard of guards) {
      if (await auth.use(guard).check()) {
        auth.defaultGuard = guard
        return true
      }
    }

    throw new UnauthorizedException('Unauthorized access', 401)
  }

  public async handle ({ auth }: HttpContextContract, next: () => Promise<void>, customGuards: (keyof GuardsList)[]) {
    const guards = customGuards.length ? customGuards : [auth.name]
    await this.authenticate(auth, guards)
    await next()
  }
}
