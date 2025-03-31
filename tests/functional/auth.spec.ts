import { test } from '@japa/runner'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Users', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should login a user with valid credentials', async ({ assert }) => {
    await User.create({
      email: 'test@test.com',
      password: 'password123',
    })

    const { body } = await supertest(BASE_URL)
      .post('/api/login')
      .send({
        email: 'test@test.com',
        password: 'password123',
      })
      .expect(200)
    assert.exists(body.token.token)
  })

  test('it should logout a user', async ({ assert }) => {
    await User.create({
      email: 'test@test.com',
      password: 'password123',
    })

    const loginResponse = await supertest(BASE_URL)
      .post('/api/login')
      .send({
        email: 'test@test.com',
        password: 'password123',
      })
      .expect(200)

    const logoutResponse = await supertest(BASE_URL)
      .post('/api/logout')
      .set('Authorization', `Bearer ${loginResponse.body.token.token}`)
      .expect(200)

    assert.equal(logoutResponse.body.message, 'Successfully logout')
  })
})
