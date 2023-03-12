export class UserAlreadyExistsError extends Error {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super('E-mail already exists')
  }
}
