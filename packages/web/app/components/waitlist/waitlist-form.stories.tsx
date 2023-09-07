import type { Meta, StoryObj } from '@storybook/react';
import {WaitlistForm} from './waitlist-form';
import NextThemeProvider from '../../providers/next-theme';




const meta: Meta<typeof WaitlistForm> = {
    title: 'Components/forms/WaitlistForm',
    component: WaitlistForm,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <NextThemeProvider>
                <div className="story-wrapper">
                    <Story />
                    <style global jsx>{`
                    .story-wrapper {
                        width: 100%;
                        height: 100%;
                    
                        max-width: var(--max-width);
                        padding: 0 var(--width-gap);

                        min-height: 5rem;
                        min-width: 5rem;
                    }
            `}</style>
                </div>
            </NextThemeProvider>
        ),
    ],
}

export default meta;
type Story = StoryObj<typeof WaitlistForm>;

const onSubmit = (email: string) => {
    console.log('Submited!', email)
}


export const Default: Story = {
    args: {
        onSubmit
    }
}

export const Hover: Story = {
    parameters: {pseudo: { hover: true }},
    args: {
        onSubmit
    }
}

export const Active: Story = {
    parameters: {pseudo: { active: true }},
    args: {
        onSubmit
    }
}

export const Focus: Story = {
    parameters: {pseudo: { focus: true }},
    args: {
        onSubmit
    }
}