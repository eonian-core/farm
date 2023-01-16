import type { Meta, StoryObj } from '@storybook/react';
import Collapse from './collapse';
import ColalapseHeader from "./collapse-header";
import CollapseContent from "./collapse-content";

// TODO: fix tailwind support for storybook
import '../../tailwind.css'

const meta: Meta<typeof Collapse> = {
    title: 'Views/Collapse',
    component: Collapse,
    tags: ['autodocs']
}

export default meta;
type Story = StoryObj<typeof Collapse>;



export const Default: Story = {
    args: {
        children: (<Collapse open={false} index={0}>
            <ColalapseHeader>What is crypto?</ColalapseHeader>
            <CollapseContent>While many claim that crypto will revolutionize the financial system, 
            in reality, people who believe in the promise have been burned by scams and fraud. </CollapseContent>
        </Collapse>)
    }
}

export const OpenAtStart: Story = {
    args: {
        children: (<Collapse open index={0}>
            <ColalapseHeader>What is crypto?</ColalapseHeader>
            <CollapseContent>While many claim that crypto will revolutionize the financial system, 
            in reality, people who believe in the promise have been burned by scams and fraud. </CollapseContent>
        </Collapse>)
    }
}