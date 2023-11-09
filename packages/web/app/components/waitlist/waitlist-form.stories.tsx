/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react'
import NextThemeProvider from '../../providers/next-theme'
import { WaitlistForm } from './waitlist-form'

const meta: Meta<typeof WaitlistForm> = {
  title: 'Components/forms/WaitlistForm',
  component: WaitlistForm,
  tags: ['autodocs'],
  decorators: [
    Story => (
            <NextThemeProvider>
                <div className="story-wrapper">
                    <Story />
                    <style global jsx>{`
                        .story-wrapper {
                            width: 100%;
                            height: 100%;
                        
                            max-width: var(--max-width);
                            padding: 5rem var(--width-gap);

                            min-height: 5rem;
                            min-width: 5rem;
                        }
                `}</style>
                </div>
            </NextThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof WaitlistForm>

async function onSubmit(email: string) {
  console.log('Submitting!', email)
  await timeout(1000)
  console.log('Submitted!', email)
}

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const Default: Story = {
  args: {
    onSubmit,
  },
}

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  args: {
    onSubmit,
  },
}

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  args: {
    onSubmit,
  },
}

export const Focus: Story = {
  parameters: { pseudo: { focus: true } },
  args: {
    onSubmit,
  },
}

export const ErrorRequired: Story = {
  args: {
    onSubmit,
    error: { type: 'required' },
  },
}

export const ErrorValidate: Story = {
  args: {
    onSubmit,
    error: { type: 'validate' },
  },
}

export const DefaultEmail: Story = {
  args: {
    onSubmit,
    value: 'default@example.com',
  },
}

export const Submitting: Story = {
  args: {
    onSubmit,
    isSubmiting: true,
  },
}

export const Submitted: Story = {
  args: {
    onSubmit,
    isSubmitted: true,
  },
}
