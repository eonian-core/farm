import React, { useState, useCallback, useRef } from "react";

import { useForm, SubmitHandler, FieldError } from "react-hook-form"
import { EmailInput } from "./input";
import styles from "./waitlist-form.module.scss";
import Button from "../button/button";
import IconArrowRightShort from "../icons/icon-arrow-right-short";
import TextTransition, { presets } from "react-text-transition";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import clsx from "clsx";

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

    const [isHovered, hoverProps] = useOnHover();

    return (
        <form 
            {...hoverProps}
            className={styles.form}
            onSubmit={handleSubmit((data: WaitlistInputs) => {
                onSubmit(data.email)
            })}>

                <div className={styles.container}>
                    
                    <Emaillabel error={errors.email} focused={isHovered} />
                    <EmailInput 
                        id="email"
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

export const Emaillabel = (props: EmailLabelProps) => {
    const text = genLabel(props)

    return (<label htmlFor="email"><span className={styles.parts}>Email</span>{!text ? '' : ' '}<EmailLabelText {...{text}} /></label>)
}

export const EmailLabelText = ({text}: {text: string}) => {
    const nodeRef = useRef<HTMLElement | null>(null);

    return (
        <SwitchTransition>
            <CSSTransition
                key={text}
                nodeRef={nodeRef}
                addEndListener={(done: any) => {
                    nodeRef.current?.addEventListener?.("transitionend", done, false);
                  }}
                classNames={{
                    enter: styles.partsEnter,
                    enterActive: styles.partsEnterActive,
                    enterDone: styles.partsEnterDone,
                    exit: styles.partsExit,
                    exitActive: styles.partsExitActive,
                    exitDone: styles.partsExitDone,
                }}
            ><span className={clsx(styles.parts, {[styles.partsFocused]: !text})} ref={nodeRef}>{text}</span></CSSTransition>
        </SwitchTransition>
    )
}
// must be function, not a companent to make animation work
export const genLabel = ({focused, error}: EmailLabelProps) => {

    if (error?.type === 'required') {
        return `is needed to join the waitlist`
    }

    if (error?.type === 'validate') {
        return `must contain "@" and "." characters`
    }

    if(focused) {
        return ``
    }

    return (
        `me when I can access app`
    )
}

/** Simple hook to setup and detect hover */
const useOnHover = () => {
    const [hover, setHover] = useState(false);

    const onMouseEnter = useCallback(() => setHover(true), []);
    const onMouseLeave = useCallback(() => setHover(false), []);

    return [hover, { onMouseEnter, onMouseLeave }] as const;
}