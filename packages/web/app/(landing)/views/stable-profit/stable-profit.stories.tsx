import type { Meta, StoryFn } from '@storybook/react'
import { H2 } from '../../../components/heading/heading'
import StableProfit from './stable-profit'

const meta: Meta<typeof StableProfit> = {
  title: 'Views/StableProfit',
  component: StableProfit,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="story-wrapper">
        <Story />
        <style global jsx>{`
          .story-wrapper {
            width: 100%;
            height: 100%;
            min-height: 100vh;
          }
        `}</style>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

const Template: StoryFn<typeof StableProfit> = props => (
  <StableProfit {...props}>
    <H2>Stable and High Yield</H2>
    <p>
      Our focus is on not only achieving high returns, but also ensuring stability in our work and investment
      strategies. While a high APY may be attractive, it is important to consider the sustainability and consistency of
      the results.
    </p>
    <ul>
      <li>
        <h3>Stable Rewards</h3>
        We diversify the investments across multiple protocols and continuously monitor their rewards to ensure
        stability in your profits.
      </li>
      <li>
        <h3>High Rewards</h3>
        We continuously enhance our investment strategies with the knowledge of crypto experts to generate the highest
        possible rewards in DeFi space.
      </li>
      <li>
        <h3>Lower Fees</h3>
        We minimize fees for our clients by combining transactions from multiple users and reducing interactions with
        other protocols.
      </li>
      <li>
        <h3>Effective Strategies</h3>
        Prior to investment, we thoroughly evaluate protocols to identify any hidden fees and optimize our strategies to
        minimize them.
      </li>
      <li>
        <h3>Real Yield</h3>
        We provide rewards exclusively in the form of the tokens in which you have invested. To mitigate the effects of
        inflation, we sell tokens issued by the underlying protocols.
      </li>
      <li>
        <h3>Real APY</h3>
        Other protocols may show you big numbers to entice you to invest, while we provide a realistic estimate of the
        returns you can expect.
      </li>
    </ul>
  </StableProfit>
)

export const Default = Template.bind({})
Default.args = {}
