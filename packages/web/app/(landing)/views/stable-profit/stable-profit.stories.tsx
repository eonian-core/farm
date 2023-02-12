import type { Meta, StoryFn } from "@storybook/react";
import { H2 } from "../../../components/heading/heading";
import ColumnItem from "../../../components/page-with-columns/column-item";
import StableProfit from "./stable-profit";

const meta: Meta<typeof StableProfit> = {
  title: "Views/StableProfit",
  component: StableProfit,
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

const Template: StoryFn<typeof StableProfit> = (props) => {
  return (
    <StableProfit {...props}>
      <H2>Stable and High Yield</H2>
      <p>
        Our focus is on not only achieving high returns, but also ensuring
        stability in our work and investment strategies. While a high APY may be
        attractive, it is important to consider the sustainability and
        consistency of the results.
      </p>
      <ColumnItem title="Stable Rewards">
        We diversify the investments across multiple protocols and continuously
        monitor their rewards to ensure stability in your profits.
      </ColumnItem>
      <ColumnItem title="High Rewards">
        We continuously enhance our investment strategies with the knowledge of
        crypto experts to generate the highest possible rewards in DeFi space.
      </ColumnItem>
      <ColumnItem title="Lower Fees">
        We minimize fees for our clients by combining transactions from multiple
        users and reducing interactions with other protocols.
      </ColumnItem>
      <ColumnItem title="Effective Strategies">
        Prior to investment, we thoroughly evaluate protocols to identify any
        hidden fees and optimize our strategies to minimize them.
      </ColumnItem>
      <ColumnItem title="Real Yield">
        We provide rewards exclusively in the form of the tokens in which you
        have invested. To mitigate the effects of inflation, we sell tokens
        issued by the underlying protocols.
      </ColumnItem>
      <ColumnItem title="Real APY">
        Other protocols may show you big numbers to entice you to invest, while
        we provide a realistic estimate of the returns you can expect.
      </ColumnItem>
    </StableProfit>
  );
};

export const Default = Template.bind({});
Default.args = {};
