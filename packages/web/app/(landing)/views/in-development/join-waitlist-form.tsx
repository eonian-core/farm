import {Input, Button} from "@nextui-org/react";
import React, { useState, useCallback } from "react";
import { useWaitlist } from "../../../providers/waitlist";

export const JoinWaitlistForm = () => {
    const [email, setEmail] = useState("");

    const handleEmailChange = useCallback((e: any) => {
        setEmail(e.target.value);
    }, []);

    const {join} = useWaitlist()

    const handleSubmit = useCallback(() => {
        // Submit the email here
        console.log(email);
        join(email)
    }, [join, email]);

    return (
        <div>
            <Input type="email" label="Email" value={email} onChange={handleEmailChange} />
            <Button color="primary" onClick={handleSubmit}>
                Join
            </Button>
        </div>
    )
}