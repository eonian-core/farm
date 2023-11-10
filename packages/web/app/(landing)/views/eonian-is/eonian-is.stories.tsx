import type { Meta, StoryObj } from '@storybook/react'
import heading from '../../../components/heading/heading'

import { EonianIs } from './eonian-is'

const meta: Meta<typeof EonianIs> = {
  title: 'Views/EonianIs',
  component: EonianIs,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="story-wrapper">
        <Story />
        <style global jsx>{`
          .story-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
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
type Story = StoryObj<typeof EonianIs>

export const Default: Story = {
  args: {
    children: (
      <>
        <heading.H2>
          Eonian is a Decentralized <br /> Yield Aggregator
        </heading.H2>
        <p>
          The protocol generates <a href="/faq#what-is-real-yield">real yield</a> rewards by distributing liquidity to
          the most profitable and secure projects on the blockchain. It uses multiple smart contracts to collect and
          reinvest rewards in a way that maximizes your profit and decrease the time you spend on investments.{' '}
        </p>
      </>
    ),
  },
}
