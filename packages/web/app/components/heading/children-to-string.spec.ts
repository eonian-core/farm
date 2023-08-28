import { childToString } from './children-to-string'

describe('childToString', () => {
  it('should return undefined for falsy children', () => {
    expect(childToString(undefined)).toBeUndefined()
    expect(childToString(null)).toBeUndefined()
  })

  it('should return string value of children', () => {
    expect(childToString('Hello')).toBe('Hello')
    expect(childToString(123)).toBe('123')
    expect(childToString([1, 2, 3])).toBe('1,2,3')
  })

  it('should remove ",[object Object]," if present in children', () => {
    expect(childToString('Hello ,[object Object],')).toBe('Hello ')
    expect(childToString('Hello ,[object Object], World')).toBe('Hello  World')
    expect(childToString(',[object Object], Testing ,[object Object],')).toBe(' Testing ')
  })
})
