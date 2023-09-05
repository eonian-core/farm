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
                    }
            `}</style>
                </div>
            </NextThemeProvider>
        ),
    ],
}

export default meta;
type Story = StoryObj<typeof WaitlistForm>;

export const Default: Story = {
    args: {
        onSubmit: (email: string) => {
            console.log('Submited!', email)
        }
    }
}