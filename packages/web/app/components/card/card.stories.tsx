import type { Meta, StoryObj } from '@storybook/react'

import { Card, Target } from './card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="story-wrapper">
        <Story />
        <style global jsx>{`
          .story-wrapper {
            width: 100%;
            height: 100%;

            max-width: var(--width-700);
            padding: 0 var(--width-gap);
          }
        `}</style>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    href: 'https://google.com',
    children: (
      <>
        <h3>This is example Card</h3>
        <p>It is used to wrap block with header and text as card.</p>
        <Target>Target</Target>
      </>
    ),
  },
}

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  args: {
    href: 'https://google.com',
    children: (
      <>
        <h3>This is example Card</h3>
        <p>It is used to wrap block with header and text as card.</p>
        <Target>Target</Target>
      </>
    ),
  },
}

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  args: {
    href: 'https://google.com',
    children: (
      <>
        <h3>This is example Card</h3>
        <p>It is used to wrap block with header and text as card.</p>
        <Target>Target</Target>
      </>
    ),
  },
}
