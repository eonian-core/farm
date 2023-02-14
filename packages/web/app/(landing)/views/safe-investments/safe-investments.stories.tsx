import type { Meta, StoryFn } from "@storybook/react";
import { H2 } from "../../../components/heading/heading";
import ColumnItem from "../../../components/page-with-columns/column-item";
import SafeInvestments from "./safe-investments";

const meta: Meta<typeof SafeInvestments> = {
  title: "Views/SafeInvestments",
  component: SafeInvestments,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
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
    layout: "fullscreen",
  },
};

export default meta;

const Template: StoryFn<typeof SafeInvestments> = (props) => {
  return (
    <SafeInvestments {...props}>
      <H2>Safe Investments</H2>
      <p>
        We bring our expertise in enterprise-grade software development to the
        cryptocurrency industry. Utilizing proven security operations (SecOps)
        and software development life cycle (SSDLC) monitoring and testing
        methods, we strive to deliver the safest solution possible.
      </p>
      <ColumnItem title="Hacks Protection">
        We constantly monitor DeFi-related hacks in other protocols and develop
        defense mechanisms to keep our contracts safe from potential threats.
      </ColumnItem>
      <ColumnItem title="Fraud Monitoring">
        We continuously monitor the transactions of investment protocols and
        take action to ensure the security of our clients investments by
        promptly withdrawing funds in case of any suspicious activity.
      </ColumnItem>
      <ColumnItem title="Independent Audits">
        We conduct independent 95-point audits of investment protocols to
        thoroughly evaluate their security and ensure that we only select the
        safest options for our clients.
      </ColumnItem>
      <ColumnItem title="Vertical Safety Integration">
        We collaborate with the teams of investment protocols to proactively
        identify and address vulnerabilities to prevent potential abuse.
      </ColumnItem>
      <ColumnItem title="Permissionless Protocol">
        Our protocol is decentralized and operates on permissionless model. Our
        smart contracts are designed to ensure that only you have access to your
        tokens.
      </ColumnItem>
    </SafeInvestments>
  );
};

export const Default = Template.bind({});
Default.args = {};
