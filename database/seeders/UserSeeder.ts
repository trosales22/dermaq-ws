import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import GeneralConstants from 'App/Constants/GeneralConstants'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.firstOrCreate({
      email: 'admin@dermaq.ph'
    }, {
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Admin',
      password: 'Admin@123',
      profileType: GeneralConstants.ROLE_TYPES.ADMIN
    })
  }
}
