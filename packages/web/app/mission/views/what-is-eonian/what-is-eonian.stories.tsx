import type { Meta, StoryObj } from '@storybook/react';
import Card from '../../../components/card/card';
import heading from "../../../components/heading/heading";

import { WhatIsEonian } from './what-is-eonian';

const meta: Meta<typeof WhatIsEonian> = {
    title: 'Views/WhatIsEonian',
    component: WhatIsEonian,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
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

export default meta;
type Story = StoryObj<typeof WhatIsEonian>;

export const Default: Story = {
    args: {
        children: (<>
            <heading.H2>What is Eonian?</heading.H2>
            <p>Eonian is a decentralized <a href="/faq#what-is-yield-aggregator">crypto yield aggregator</a> that enables users to earn passive income from their crypto assets.</p>
            <p>Eonian primary purpose is to make crypto a simpler and safer replacement for the traditional financial system. 
                This is why we not only prioritize the safety of users funds but also grant users ownership of the protocols. 
                We are building a DAO that will own the protocol and direct its future development.</p>

        </>)
    }
}
