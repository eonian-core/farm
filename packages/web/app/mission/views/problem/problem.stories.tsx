import type { Meta, StoryObj } from '@storybook/react'
import Category from '../../../components/category/category'
import heading from '../../../components/heading/heading'

import { Problem } from './problem'

const meta: Meta<typeof Problem> = {
  title: 'Views/Problem',
  component: Problem,
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
type Story = StoryObj<typeof Problem>

export const Default: Story = {
  args: {
    children: (
      <>
        <Category>The Problem</Category>
        <heading.H2>
          Crypto Promised <br /> The New Financial System
        </heading.H2>
        <p>
          While many claim that crypto will revolutionize the financial system, in reality, people who believe in the
          promise have been burned by scams and fraud.{' '}
        </p>

        <p>Dont let this happen to you.</p>
      </>
    ),
  },
}
