# Reward APY Calculations and Accuracy

This page describes base logic of reward APY calculation and accuracy. In general there no possiblity to predict future, espesially in case of interest rate, which fully based on supply and demand of different protocols. But we still want to calculate APY as accurate as possible. This information important for two reasons:

* To allow our distribution models to make better decisions in which protocols to invest.
* Show to users more accurate information about their investments.

## Compound Interest Rate Model

Our current investment strategies based on Compound protocol forks. So all calculations of reward APY for the Compound interest rate model are applicable to them also. With the exception of protocol and chain specific parameters like block rate per year.

In future we want implement more sofisticated APY calculations models based on historic data, but at current moment this is simplest and most accurate model, which possible to implement in usefull time.

### ApeSwap Lending / Ola finance

ApeSwap Lending protocol is developed by Ola finance, which forked it from Compound. So all calculations for the Compound interest rate model are applicable to ApeSwap Lending. Ola Finance using [Jump Rate Model](https://ianm.com/posts/2020-12-20-understanding-compound-protocols-interest-rates#the-jump-rate-model). Which in general implemented correctly. But this model requires blocks per year parameter, which is not implemented correctly. In the code it's set to 31536000, which is 60 * 60 * 24 * 365. But in reality it's 10475500, because of [28700 blocks per day](https://ycharts.com/indicators/binance_smart_chain_blocks_per_day), or [3.01 second block time](https://ycharts.com/indicators/binance_smart_chain_average_block_time). This parameter is used in the calculation of the interest rate per block. But in current implementation Ola Finance switched from block based to timestamp based calculations, this creates small room for manipulation by miners, but in general not significant. So in the current implementation, the interest rate calculations must be more or less correct, but lead to requirement that all APY calculations must expect that interest rate calculated per second instead of per block. 


## Sources

* https://docs.compound.finance/interest-rates/
* https://compound.finance/markets/WBTC
* https://ianm.com/posts/2020-12-20-understanding-compound-protocols-interest-rates