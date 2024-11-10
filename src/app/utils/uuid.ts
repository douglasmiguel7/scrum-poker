import { v4, validate, version } from 'uuid'

export const randomUuid = () => v4()

export const validateUuid = (uuid: unknown) =>
  validate(uuid) && version(uuid as string) === 4
