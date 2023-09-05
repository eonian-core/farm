import clsx from 'clsx';
import {InputHTMLAttributes} from 'react';
import styles from './input.module.scss';

export interface EmailInputProps extends InputHTMLAttributes<HTMLInputElement> {

}

export const EmailInput = ({className, ...props}: EmailInputProps) => {
    return <input 
        className={clsx(className, styles.input)} 
        spellCheck="false" 
        type="email"
        {...props}  
    /> 
}