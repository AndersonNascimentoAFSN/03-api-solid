import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Anderson Nascimento',
    email: 'anderson.nascimento@gmail.com.br',
  },
})
