import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function CreateAndAuthenticateUser(app: FastifyInstance) {
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

  return { token }
}
