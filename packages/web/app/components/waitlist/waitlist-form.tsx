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
import IconCheck from "../icons/icon-check";
import IconPencil from "../icons/icon-pencil";

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

    isSubmiting?: boolean
    isSubmitted?: boolean
};

interface WaitlistInputs {
    email: string
}

export const WaitlistForm = ({ onSubmit, value, ...props }: WaitlistFormProps) => {
    const {
        register,
        handleSubmit,
        watch,
        formState,
    } = useForm<WaitlistInputs>({
        defaultValues: {
            email: value, 
        },
    })

    const [isHovered, hoverProps] = useOnHover();
    const [isFocused, focusProps] = useOnFocus();
    const isEmpty = !(watch("email")?.length > 0);
    const isActive = isHovered || isFocused || !isEmpty;

    const {errors} = formState
    const error = errors.email || props.error
    const isSubmitting = (props.isSubmiting || formState.isSubmitting) && !error
    const isSubmitted = (props.isSubmitted || formState.isSubmitSuccessful) && !error

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

                <EmailLabel error={error} focused={isActive} />
                <StateIcon isEmpty={isEmpty} />
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
                    iconPosition="left"
                    icon={ <SubmitIcon {...{isSubmitting, isSubmitted}} />}
                >
                    {isSubmitted && <span className={styles.submitText}>You are Awesome!</span>}
                </Button>
            </div>


        </form>
    )
}

const StateIcon = ({isEmpty}: {isEmpty: boolean}) => {

    if(!isEmpty) {
        return <IconPencil className={styles.icon} width="2.5rem" height="2.5rem" />
    }

    return <IconEmail className={styles.icon} width="2.5rem" height="2.5rem" />
}

interface SubmitIconProps {
    isSubmitting?: boolean;
    isSubmitted?: boolean;
}


const SubmitIcon = ({isSubmitting, isSubmitted}: SubmitIconProps) => {
    if (isSubmitting) {
        return <Loading aria-label="Loading..." />;
    }

    if (isSubmitted) {
        return <IconCheck width="2.5rem" height="2.5rem" />;
    }

    return <IconArrowRightShort width="2.5rem" height="2.5rem" />;

}