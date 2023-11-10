export interface Numberimits {
  max?: number
  min?: number
}

export function alignToLimits(count: number, { min, max }: Numberimits) {
  if (min === undefined && max === undefined) {
    return count
  }

  if (min === undefined) {
    return Math.min(count, max!)
  }

  if (max === undefined) {
    return Math.max(count, min)
  }

  return Math.max(Math.min(count, max), min)
}
