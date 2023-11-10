import type { Meta, StoryObj } from '@storybook/react'
import Card, { Target } from '../../../components/card/card'
import heading from '../../../components/heading/heading'

import { Revolution } from './revolution'

const meta: Meta<typeof Revolution> = {
  title: 'Views/Revolution',
  component: Revolution,
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
type Story = StoryObj<typeof Revolution>

export const Default: Story = {
  args: {
    children: (
      <>
        <heading.H2>Revolution in Finances</heading.H2>o
        <p>
          Eonian primary purpose is to make crypto a simpler and safer replacement for the traditional financial system.
          This is why we not only prioritize the safety of users funds but also grant users ownership of the protocols.
          We are building a DAO that will own the protocol and direct its future development.
        </p>
        <Card href={'https://t.me/+9yTj0kBHbMozMDAy'}>
          <h3>Join us</h3>

          <p>
            Join our DAO to make your contribution to a better future for DeFi! Help us to build the financial system
            which humanity deserves.
          </p>

          <Target>Telegram</Target>
        </Card>
      </>
    ),
  },
}
