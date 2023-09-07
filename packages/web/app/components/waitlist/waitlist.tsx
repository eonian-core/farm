import Card from "../card/card";
import { useWaitlist } from "../../providers/waitlist";
import { WaitlistForm } from "./waitlist-form";

export interface WaitlistProps {
    /** content of the block, expected to have: h2, p for Card which will be shown after user joined */
    children: React.ReactNode
}

export const WaitList = ({ children }: WaitlistProps) => {

    const {join, isJoined, openDashboard} = useWaitlist()

    if(isJoined) 
        return (
            <Card onClick={openDashboard}>
                {children}
            </Card>
        )

    return <WaitlistForm onSubmit={join} />
}