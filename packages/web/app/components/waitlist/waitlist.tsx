import { useCallback, useState } from 'react'
import Card from '../card/card'
import { useWaitlist } from '../../providers/waitlist'
import { WaitlistForm } from './waitlist-form'

export interface WaitlistProps {
  /** content of the block, expected to have: h2, p for Card which will be shown after user joined */
  children: React.ReactNode
}

const SHOW_DASHBOARD_BUTTON_DELAY = 3000

export function WaitList({ children }: WaitlistProps) {
  const [isJustSubmited, setIsJustSubmited] = useState(false)
  const { join, isJoined, openDashboard } = useWaitlist()

  const joinAndTrack = useCallback(async (email: string) => {
    await join(email)

    setIsJustSubmited(true)
    setTimeout(() => setIsJustSubmited(false), SHOW_DASHBOARD_BUTTON_DELAY)
  }, [join, setIsJustSubmited])

  if (isJoined && !isJustSubmited) {
    return (
            <Card onClick={openDashboard}>
                {children}
            </Card>
    )
  }

  return <WaitlistForm onSubmit={joinAndTrack} />
}
