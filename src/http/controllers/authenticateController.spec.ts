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

  it.only('should be able to authenticate', async () => {
    await request(app.server).post('/v1/users').send({
      name: 'John doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const response = await request(app.server).post('/v1/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
