import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('User Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.only('should be able to create user', async () => {
    const response = await request(app.server).post('/v1/users').send({
      name: 'John doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })

  it.only('should be able to get user profile', async () => {
    await request(app.server).post('/v1/users').send({
      name: 'John doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/v1/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/v1/profile')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({ email: 'john.doe@example.com' }),
    )
  })
})
