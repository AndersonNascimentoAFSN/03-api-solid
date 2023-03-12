import { hash } from 'bcryptjs'

export async function createHashPassword(password: string) {
  const password_hash = await hash(password, 6)
  return password_hash
}
