import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (error) {
    return reply.status(401).send({
      status: 'Unauthorized',
      code: 401,
      message: 'user not authorized',
    })
  }
}
