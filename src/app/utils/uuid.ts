import { v4, validate, version } from 'uuid'

export const randomUuid = () => v4()

export const validateUuid = (uuid: string): boolean => {
  return validate(uuid) && version(uuid) === 4
}
