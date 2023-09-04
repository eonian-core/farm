import {Input, Button} from "@nextui-org/react";
import React, { useState, useCallback } from "react";
import { useWaitlist } from "../../../providers/waitlist";
import Card from "../../../components/card/card";

interface JoinWaitlistFormProps {
    /** content of the block, expected to have: h2, p for Card which will be shown after user joined */
    children: React.ReactNode
};


export const JoinWaitlistForm = ({children}: JoinWaitlistFormProps) => {
    const [email, setEmail] = useState("");

    const handleEmailChange = useCallback((e: any) => {
        setEmail(e.target.value);
    }, []);

    const {join, isJoined, openDashboard} = useWaitlist()

    const handleSubmit = useCallback(() => {
        join(email)
    }, [join, email]);

    if(isJoined) return (
        <Card onClick={openDashboard}>
            {children}
        </Card>
    )

    return (
        <div>
            <Input type="email" label="Email" value={email} onChange={handleEmailChange} />
            <Button color="primary" onClick={handleSubmit}>
                Join
            </Button>
        </div>
    )
}