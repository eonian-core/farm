import type { Meta, StoryObj } from '@storybook/react'

import IconExternal from '../icons/icon-external'
import IconDiscord from '../icons/icon-discord'
import IconTwitter from '../icons/icon-twitter'
import Button from './button'

function Component() {
  return (
    <div className="column">
      <div className="row">
        <Button>Lorem ipsum</Button>
        <Button bordered>Lorem ipsum</Button>
        <Button gradient>Lorem ipsum</Button>
      </div>
      <div className="row">
        <Button disabled>Lorem ipsum</Button>
        <Button disabled bordered>Lorem ipsum</Button>
        <Button disabled gradient>Lorem ipsum</Button>
      </div>
      <div className="row">
        <Button icon={<IconExternal />}>Join the Waitlist</Button>
        <Button icon={<IconDiscord />} bordered>
          Lorem ipsum
        </Button>
        <Button icon={<IconTwitter />} gradient>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button dark>Lorem ipsum</Button>
        <Button dark bordered>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button dark icon={<IconExternal />}>
          Join the Waitlist
        </Button>
        <Button dark icon={<IconDiscord />} bordered>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button size="lg">Lorem ipsum</Button>
        <Button size="lg" bordered>
          Lorem ipsum
        </Button>
        <Button size="lg" gradient>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button size="lg" icon={<IconExternal />}>
          Join the Waitlist
        </Button>
        <Button size="lg" icon={<IconDiscord />} bordered>
          Lorem ipsum
        </Button>
        <Button size="lg" icon={<IconTwitter />} gradient>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button size="lg" dark>
          Lorem ipsum
        </Button>
        <Button size="lg" dark bordered>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button size="lg" dark icon={<IconExternal />}>
          Join the Waitlist
        </Button>
        <Button size="lg" dark icon={<IconDiscord />} bordered>
          Lorem ipsum
        </Button>
      </div>

      {/* ROUDNED */}
      <div className="row">
        <Button round>Lorem ipsum</Button>
        <Button round bordered>Lorem ipsum</Button>
        <Button round gradient>Lorem ipsum</Button>
      </div>
      <div className="row">
        <Button round disabled>Lorem ipsum</Button>
        <Button round bordered disabled>Lorem ipsum</Button>
        <Button round gradient disabled>Lorem ipsum</Button>
      </div>
      <div className="row">
        <Button round icon={<IconExternal />}>Join the Waitlist</Button>
        <Button round icon={<IconDiscord />} bordered>
          Lorem ipsum
        </Button>
        <Button round icon={<IconTwitter />} gradient>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button round dark>Lorem ipsum</Button>
        <Button round dark bordered>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button round dark icon={<IconExternal />}>
          Join the Waitlist
        </Button>
        <Button round dark icon={<IconDiscord />} bordered>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button round size="lg">Lorem ipsum</Button>
        <Button round size="lg" bordered>
          Lorem ipsum
        </Button>
        <Button round size="lg" gradient>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button round size="lg" icon={<IconExternal />}>
          Join the Waitlist
        </Button>
        <Button round size="lg" icon={<IconDiscord />} bordered>
          Lorem ipsum
        </Button>
        <Button round size="lg" icon={<IconTwitter />} gradient>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button round size="lg" dark>
          Lorem ipsum
        </Button>
        <Button round size="lg" dark bordered>
          Lorem ipsum
        </Button>
      </div>
      <div className="row">
        <Button round size="lg" dark icon={<IconExternal />}>
          Join the Waitlist
        </Button>
        <Button round size="lg" dark icon={<IconDiscord />} bordered>
          Lorem ipsum
        </Button>
      </div>
    </div>
  )
}

const meta: Meta<typeof Component> = {
  title: 'Components/Button',
  component: Component,
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
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }

          .column {
            display: flex;
            justify-content: center;
            align-item: center;
            flex-direction: column;
          }

          .column .row + .row {
            margin-top: 40px;
          }

          .row {
            display: flex;
            justify-content: center;
            align-item: center;
          }

          .row button + button {
            margin-left: 20px;
          }
        `}</style>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Component>

export const Default: Story = {}
