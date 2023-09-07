import React, { useState, useCallback, useRef } from "react";
import {Loading} from "@nextui-org/react";

import { useForm, SubmitHandler, FieldError } from "react-hook-form"
import { EmailInput } from "./input";
import styles from "./waitlist-form.module.scss";
import Button from "../button/button";
import IconArrowRightShort from "../icons/icon-arrow-right-short";

import clsx from "clsx";
import { EmailLabel } from "./label";
import { useOnFocus, useOnHover } from "./state-hooks";
import IconEmail from "../icons/icon-email";

/**
 * Props for the WaitlistForm component.
 */
export interface WaitlistFormProps {
    /** Override state of error */
    error?: FieldError
    /**
     * Callback function that is invoked when the form is submitted.
     * @param email - The email entered in the form.
     */
    onSubmit: (email: string) => Promise<void>
    
    /** Default value for the input */
    value?: string
};

interface WaitlistInputs {
    email: string
}

export const WaitlistForm = ({ onSubmit, error, value }: WaitlistFormProps) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm<WaitlistInputs>({
        defaultValues: {
            email: value, 
        },
    })

    const [isHovered, hoverProps] = useOnHover();
    const [isFocused, focusProps] = useOnFocus();
    const isActive = isHovered || isFocused || watch("email")?.length > 0;

    const registerProps = register("email", {
        required: "required",
        pattern: /\S+@\S+\.\S+/ // validate email format
    });
    
    return (
        <form
            {...hoverProps}
            className={clsx(styles.form, { 
                [styles.active]: isActive,
                [styles.submitting]: isSubmitting,
                [styles.submitted]: isSubmitted,
            })}
            onSubmit={handleSubmit(async (data: WaitlistInputs) => {
                await onSubmit(data.email)
            })}>

            <div className={styles.container}>

                <EmailLabel error={errors.email || error} focused={isActive} />

                <IconEmail className={styles.icon} width="2.5rem" height="2.5rem" />

                <EmailInput
                    id="email"
                    {...focusProps}
                    {...registerProps}
                    onBlur={(...args) => {
                        registerProps.onBlur(...args)
                        focusProps.onBlur()
                    }}
                />

                <Button
                    className={styles.submit}
                    round
                    gradient
                    type="submit"
                    icon={
                        isSubmitting || isSubmitted 
                            ? <Loading aria-label="Loading..." />
                            : <IconArrowRightShort width="2.5rem" height="2.5rem" />
                    }
                ></Button>
            </div>


        </form>
    )
}

