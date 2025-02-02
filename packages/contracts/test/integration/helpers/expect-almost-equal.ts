import { expect } from 'chai'

export function percentDifference(aBN: bigint, bBN: bigint): number {
  const a = Number(aBN)
  const b = Number(bBN)
  const lower = Math.min(a, b)
  const bigger = Math.max(a, b)
  return 100 - (lower / bigger * 100)
}

export function isAlmostEqual(aBN: bigint, bBN: bigint, precision = 0.1): boolean {
  return percentDifference(aBN, bBN) < precision
}

export function expectAlmostEqual(aBN: bigint, bBN: bigint, message?: string, precision = 0.1) {
  expect(isAlmostEqual(aBN, bBN, precision), message).to.be.eq(true)
}
