import type { Meta, StoryObj } from '@storybook/react'

import { GradientCard } from './gradient-card'

const meta: Meta<typeof GradientCard> = {
  title: 'Components/GradientCard',
  component: GradientCard,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="story-wrapper">
        <Story />
        <style global jsx>{`
          .story-wrapper {
            width: calc(100% + 40px) !important;
            height: 100%;
            margin: 0 -20px;
          }
        `}</style>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof GradientCard>

export const Default: Story = {
  args: {
    children: (
      <>
        <h3>This is example GradientCard</h3>
        <p>It is used to wrap block with header and text as GradientCard.</p>
      </>
    ),
  },
}
