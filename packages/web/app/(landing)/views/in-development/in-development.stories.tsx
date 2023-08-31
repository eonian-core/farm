import type { Meta, StoryObj } from '@storybook/react'
import Card from '../../../components/card/card'
import heading from '../../../components/heading/heading'

import { InDevelopment } from './in-development'

const meta: Meta<typeof InDevelopment> = {
  title: 'Views/InDevelopment',
  component: InDevelopment,
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
type Story = StoryObj<typeof InDevelopment>

export const Default: Story = {
  args: {
    children: (
      <>
        <heading.H2>
          Future <br /> of Investments
        </heading.H2>
        <p>
          Were in the early stages of developing our innovative protocol, and were excited to invite you to join us on
          this journey. Your feedback and suggestions will play a crucial role in shaping the direction of our project.
          Together, we can build something truly great! We can make the future of investment simple and accessible for
          all. We are currently working hard on the first version of our protocol, and with your help, we can make it
          better.
        </p>

        <Card href={'https://t.me/+9yTj0kBHbMozMDAy'}>
          <h3>Join us</h3>

          <p>
            In our Telegram youll have the opportunity to connect with industry experts and like-minded individuals.
            Were committed to creating a collaborative and supportive community, so dont hesitate to ask!
          </p>
        </Card>
      </>
    ),
  },
}
