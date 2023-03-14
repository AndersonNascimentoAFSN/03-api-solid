import { compare } from 'bcryptjs'

type compareHashPasswordPassword = {
  hash: string
  password: string
}

export async function compareHashPassword({
  password,
  hash,
}: compareHashPasswordPassword) {
  const doesPasswordMatches = await compare(password, hash)
  return doesPasswordMatches
}
