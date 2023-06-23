import { BigDecimal } from "@graphprotocol/graph-ts";
import { InterestRate } from "../generated/schema";

  // update rates as APR as it is done for aave subgraphs
  const supplyRate = params.poolSupplyRate
    .toBigDecimal()
    .div(exponentToBigDecimal(market._indexesOffset));

  const borrowRate = params.poolBorrowRate
    .toBigDecimal()
    .div(exponentToBigDecimal(market._indexesOffset));
  const poolSupplyRate = createInterestRate(
    market.id,
    InterestRateSide.LENDER,
    InterestRateType.VARIABLE,
    supplyRate.times(BIGDECIMAL_HUNDRED)
  );
  const poolBorrowRate = createInterestRate(
    market.id,
    InterestRateSide.BORROWER,
    InterestRateType.VARIABLE,
    borrowRate.times(BIGDECIMAL_HUNDRED)
  );


export function createInterestRate(
    marketAddress: string,
    rateSide: string,
    rateType: string,
    rate: BigDecimal
  ): InterestRate {
    const id: string = `${rateSide}-${rateType}-${marketAddress}`;
    const interestRate = new InterestRate(id);
  
    interestRate.rate = rate;
    interestRate.side = rateSide;
    interestRate.type = rateType;
  
    interestRate.save();
  
    return interestRate;
  }
  