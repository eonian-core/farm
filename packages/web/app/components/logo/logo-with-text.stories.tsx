import type { Meta, StoryObj } from '@storybook/react'

import LogoWithText from './logo-with-text'

const meta: Meta<typeof LogoWithText> = {
  title: 'Components/LogoWithText',
  component: LogoWithText,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="story-wrapper">
        <Story />
        <style global jsx>{`
          .story-wrapper {
            width: 100%;
            height: 100%;

            max-width: var(--max-width);
            padding: 0 var(--width-gap);
          }
        `}</style>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof LogoWithText>

export const Default: Story = {
  args: {},
}

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
}

export const Active: Story = {
  parameters: { pseudo: { active: true } },
}
