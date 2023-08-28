import type { Meta, StoryFn } from '@storybook/react'
import { H2 } from '../../../components/heading/heading'
import SafeInvestments from './safe-investments'

const meta: Meta<typeof SafeInvestments> = {
  title: 'Views/SafeInvestments',
  component: SafeInvestments,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="story-wrapper">
        <Story />
        <style global jsx>{`
          .story-wrapper {
            width: 100%;
            height: 100%;
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

const Template: StoryFn<typeof SafeInvestments> = props => (
  <SafeInvestments {...props}>
    <H2>Safe Investments</H2>
    <p>
      We bring our expertise in enterprise-grade software development to the cryptocurrency industry. Utilizing proven
      security operations (SecOps) and software development life cycle (SSDLC) monitoring and testing methods, we strive
      to deliver the safest solution possible.
    </p>
    <ul>
      <li>
        <h3>Hacks Protection</h3>
        We constantly monitor DeFi-related hacks in other protocols and develop defense mechanisms to keep our contracts
        safe from potential threats.
      </li>
      <li>
        <h3>Fraud Monitoring</h3>
        We continuously monitor the transactions of investment protocols and take action to ensure the security of our
        clients investments by promptly withdrawing funds in case of any suspicious activity.
      </li>
      <li>
        <h3>Independent Audits</h3>
        We conduct independent 95-point audits of investment protocols to thoroughly evaluate their security and ensure
        that we only select the safest options for our clients.
      </li>
      <li>
        <h3>Vertical Safety Integration</h3>
        We collaborate with the teams of investment protocols to proactively identify and address vulnerabilities to
        prevent potential abuse.
      </li>
      <li>
        <h3>Permissionless Protocol</h3>
        Our protocol is decentralized and operates on permissionless model. Our smart contracts are designed to ensure
        that only you have access to your tokens.
      </li>
    </ul>
  </SafeInvestments>
)

export const Default = Template.bind({})
Default.args = {}
