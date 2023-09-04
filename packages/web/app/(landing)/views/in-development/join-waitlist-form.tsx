import {Input, Button} from "@nextui-org/react";
import React, { useState, useCallback } from "react";
import { useWaitlist } from "../../../providers/waitlist";

export const JoinWaitlistForm = () => {
    const [email, setEmail] = useState("");

    const handleEmailChange = useCallback((e: any) => {
        setEmail(e.target.value);
    }, []);

    const {join, isJoined, openDashboard} = useWaitlist()

    const handleSubmit = useCallback(() => {
        join(email)
    }, [join, email]);

    if(isJoined) return (
        <div>
            <p>Thank you for joining</p>
            <Button color="primary" onClick={openDashboard}>
                Open dashboard
            </Button>
            </div>
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