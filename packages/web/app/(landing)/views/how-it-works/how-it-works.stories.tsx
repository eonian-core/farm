import type { Meta, StoryFn } from '@storybook/react'
import FlowDiagramContextListener from './flow-digram-context-listener'
import FlowSlider from './flow-slider'
import FlowSliderItem from './flow-slider-item'
import HowItWorks from './how-it-works'

const meta: Meta<typeof HowItWorks> = {
  title: 'Views/HowItWorks',
  component: HowItWorks,
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
            justify-content: center;
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

const Template: StoryFn<typeof HowItWorks> = props => (
  <HowItWorks {...props}>
    <FlowDiagramContextListener />
    <FlowSlider>
      <FlowSliderItem stepLabel="Deposit">
        Deposit your tokens into the Eonian protocol and watch your yield increase every second.
      </FlowSliderItem>
      <FlowSliderItem stepLabel="Find Options">
        Eonian automatically picks the high-yielding protocols and investment strategies in the DeFi space.
      </FlowSliderItem>
      <FlowSliderItem stepLabel="Allocation">
        Our protocol diversifies deposited token amounts across profitable protocols, minimizing risk and maximizing
        expected yield.
      </FlowSliderItem>
      <FlowSliderItem stepLabel="Investment">
        Eonian invests in selected protocols, allocating funds in proportions determined in the previous step.
      </FlowSliderItem>
      <FlowSliderItem stepLabel="Aggregation">
        Automatically collects rewards from all existing strategies at the optimal time, and exchanges them for the
        desired token.
      </FlowSliderItem>
      <FlowSliderItem stepLabel="Reinvestment">
        While you sleep, the protocol reinvests rewards back into the underlying protocols, choosing the most favorable
        market conditions.
      </FlowSliderItem>
      <FlowSliderItem stepLabel="Monitoring">
        Eonian constantly monitors all changes and events related to the protocols in which it has invested, preventing
        a decrease in yields and protecting against the loss of funds due to potential hacks.
      </FlowSliderItem>
      <FlowSliderItem stepLabel="Withdraw">
        Withdraw your invested funds effortlessly, anytime you need, without any limitations.
      </FlowSliderItem>
    </FlowSlider>
  </HowItWorks>
)

export const Default = Template.bind({})
Default.args = {}
