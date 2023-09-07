import React, { useState, useCallback } from "react";

import { useForm, SubmitHandler, FieldError } from "react-hook-form"
import { EmailInput } from "./input";
import styles from "./waitlist-form.module.scss";
import Button from "../button/button";
import IconArrowRightShort from "../icons/icon-arrow-right-short";

/**
 * Props for the WaitlistForm component.
 */
export interface WaitlistFormProps {
    /**
     * Callback function that is invoked when the form is submitted.
     * @param email - The email entered in the form.
     */
    onSubmit: (email: string) => void
};

interface WaitlistInputs {
    email: string
}

export const WaitlistForm = ({ onSubmit }: WaitlistFormProps) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<WaitlistInputs>()
    console.log("errors", errors)
    return (
        <form 
            className={styles.form}
            onSubmit={handleSubmit((data: WaitlistInputs) => {
                onSubmit(data.email)
            })}>

                <div className={styles.container}>
                    <Emaillabel error={errors.email} />
                    <EmailInput 
                        {...register("email", { required: true })}
                    />
                    
                    <Button 
                        className={styles.submit} 
                        round 
                        gradient
                        type="submit" 
                        icon={<IconArrowRightShort  width="2.5rem" height="2.5rem"/>}
                        ></Button>
                </div>

                
        </form>
    )
}

export interface EmailLabelProps {
    focused?: boolean
    error?: FieldError
}


export const Emaillabel = ({focused, error}: EmailLabelProps) => {

    if (error?.type === 'required') {
        return <label>Email is needed to join the waitlist</label>
    }

    if (error?.type === 'validate') {
        return <label>Email must contain "@" and "." characters</label>
    }

    if(focused) {
        return <label>Email</label>
    }

    return (
        <label>Email me when I can access app</label>
    )
}