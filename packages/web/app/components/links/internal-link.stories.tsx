import type { Meta, StoryObj } from '@storybook/react'
import IconClose from '../icons/icon-close'

import { InternalLink } from './links'

const meta: Meta<typeof InternalLink> = {
  title: 'Components/Links/InternalLink',
  component: InternalLink,
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
type Story = StoryObj<typeof InternalLink>

export const Default: Story = {
  args: {
    href: 'https://google.com',
    children: <span>It is simple link.</span>,
  },
}

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  args: {
    href: 'https://google.com',
    children: <span>It is simple link.</span>,
  },
}

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  args: {
    href: 'https://google.com',
    children: <span>It is simple link.</span>,
  },
}

export const WithIcon: Story = {
  args: {
    href: 'https://google.com',
    children: <span>It is simple link.</span>,
    icon: <IconClose />,
  },
}

export const WithIconHover: Story = {
  parameters: { pseudo: { hover: true } },
  args: {
    href: 'https://google.com',
    children: <span>It is simple link.</span>,
    icon: <IconClose />,
  },
}

export const WithIconActive: Story = {
  parameters: { pseudo: { active: true } },
  args: {
    href: 'https://google.com',
    children: <span>It is simple link.</span>,
    icon: <IconClose />,
  },
}

export const OnlyIcon: Story = {
  args: {
    href: 'https://google.com',
    icon: <IconClose />,
  },
}

export const OnlyIconHover: Story = {
  parameters: { pseudo: { hover: true } },
  args: {
    href: 'https://google.com',
    icon: <IconClose />,
  },
}

export const OnlyIconActive: Story = {
  parameters: { pseudo: { active: true } },
  args: {
    href: 'https://google.com',
    icon: <IconClose />,
  },
}
