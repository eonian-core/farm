export enum InterestRateType {
  /** Stable interest rate (e.g. Aave) */
  Stable = 0,

  /** Variable interest rate (e.g. Compound)  */
  Variable = 1,

  /** Fixed interest rate (e.g. Notional) */
  Fixed = 2,

}

// assembly script doesn't allow to use enum with string values
// so there is a workaround
export function rateTypeToString(type: InterestRateType): string {
  switch (type) {
    case InterestRateType.Stable: return 'STABLE'
    case InterestRateType.Variable: return 'VARIABLE'
    case InterestRateType.Fixed: return 'FIXED'
    default: throw new Error('Invalid InterestRateType')
  }
}

export enum InterestRateSide {
  /** Interest rate accrued by lenders */
  Lender = 0,

  /** Interest rate paid by borrowers */
  Borrower = 1,
}

// assembly script not allow to use enum with string values
// so there is a workaround
export function rateSideToString(side: InterestRateSide): string {
  switch (side) {
    case InterestRateSide.Lender: return 'LENDER'
    case InterestRateSide.Borrower: return 'BORROWER'
    default: throw new Error('Invalid InterestRateSide')
  }
}
