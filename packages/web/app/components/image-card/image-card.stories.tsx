import type { Meta, StoryObj } from '@storybook/react'
import Image from 'next/image'

import { ImageCard, Target } from './image-card'
import magnifierPic from './magnifier.png'

const meta: Meta<typeof ImageCard> = {
  title: 'Components/ImageCard',
  component: ImageCard,
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
type Story = StoryObj<typeof ImageCard>

export const Default: Story = {
  args: {
    href: 'https://google.com',
    image: <Image src={magnifierPic} alt="magnifier picture" />,
    children: (
      <>
        <h3>This is example ImageCard</h3>
        <p>It is used to wrap block with header, image, and text as card.</p>
        <Target>Target</Target>
      </>
    ),
  },
}

export const DefaultVertical: Story = {
  args: {
    href: 'https://google.com',
    image: <Image src={magnifierPic} alt="magnifier picture" />,
    isVertical: true,
    children: (
      <>
        <h3>This is example ImageCard</h3>
        <p>It is used to wrap block with header, image, and text as card.</p>
        <Target>Target</Target>
      </>
    ),
  },
}

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  args: {
    href: 'https://google.com',
    image: <Image src={magnifierPic} alt="magnifier picture" />,
    children: (
      <>
        <h3>This is example ImageCard</h3>
        <p>It is used to wrap block with header, image, and text as card.</p>
        <Target>Target</Target>
      </>
    ),
  },
}

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  args: {
    href: 'https://google.com',
    image: <Image src={magnifierPic} alt="magnifier picture" />,
    children: (
      <>
        <h3>This is example ImageCard</h3>
        <p>It is used to wrap block with header, image, and text as card.</p>
        <Target>Target</Target>
      </>
    ),
  },
}
