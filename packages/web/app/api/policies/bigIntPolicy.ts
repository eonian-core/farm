import type { FieldPolicy } from '@apollo/client'

export const bigIntPolicy: FieldPolicy<any, bigint> = {
  read: (value) => {
    if (typeof value === 'bigint') {
      return value
    }
    return BigInt(value as string | number)
  },
}
