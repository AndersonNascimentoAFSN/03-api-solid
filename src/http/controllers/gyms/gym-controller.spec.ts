import { afterAll, beforeAll, describe, expect, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

import { prisma } from '@/lib/prisma'

import { CreateAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Gym Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.$queryRaw`delete from gyms`
  })

  it.only('should be able to create a gym', async () => {
    const { token } = await CreateAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/v1/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description.',
        phone: '123456',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    expect(response.statusCode).toEqual(201)
  })

  it.only('should be able to search gyms by title', async () => {
    const { token } = await CreateAndAuthenticateUser(app)

    await request(app.server)
      .post('/v1/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description.',
        phone: '123456',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    await request(app.server)
      .post('/v1/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description.',
        phone: '123456',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const response = await request(app.server)
      .get('/v1/gyms/search')
      .query({
        q: 'JavaScript',
        page: 1,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body.gyms).toHaveLength(1)

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })

  it.only('should be able to list nearby gyms', async () => {
    const { token } = await CreateAndAuthenticateUser(app)

    await request(app.server)
      .post('/v1/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Near Gym',
        description: 'Some description.',
        phone: '123456',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    await request(app.server)
      .post('/v1/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Far Gym',
        description: 'Some description.',
        phone: '123456',
        latitude: -27.0610928,
        longitude: -49.5229501,
      })

    const response = await request(app.server)
      .get('/v1/gyms/nearby')
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body.gyms).toHaveLength(1)

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Near Gym',
      }),
    ])
  })
})
