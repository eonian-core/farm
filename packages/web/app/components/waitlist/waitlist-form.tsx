import { Input, Button } from "@nextui-org/react";
import React, { useState, useCallback } from "react";

import { useForm, SubmitHandler } from "react-hook-form"
import { EmailInput } from "./input";
import styles from "./waitlist-form.module.scss";

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

    return (
        <form 
            className={styles.form}
            onSubmit={handleSubmit((data: WaitlistInputs) => {
                onSubmit(data.email)
            })}>

            <EmailInput 
                {...register("email", { required: true })}
            />
            <Emaillabel error={errors.email as any} />

            <button color="primary" type="submit" >
                Join Waitlist
            </button>
        </form>
    )
}

export enum EmailInputError {
    Required = 'required',
    Invalid = 'invalid'
}

export interface EmailLabelProps {
    focused?: boolean
    error?: EmailInputError
}


export const Emaillabel = ({focused, error}: EmailLabelProps) => {

    if (error === EmailInputError.Required) {
        return <label>Email is needed to join the waitlist</label>
    }

    if (error === EmailInputError.Invalid) {
        return <label>Email must contain "@" and "." characters</label>
    }

    if(focused) {
        return <label>Email</label>
    }

    return (
        <label>Email me when I can access it</label>
    )
}