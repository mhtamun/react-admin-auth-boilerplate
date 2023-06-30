import React, { FocusEvent } from 'react';
import { InputText } from 'primereact/inputtext';

const Input = (props: {
    name: string;
    type?: string;
    title: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.FormEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    isDisabled?: boolean;
    errorMessage?: string;
}) => {
    const {
        name,
        type = null,
        title,
        placeholder,
        value,
        onChange,
        onBlur,
        isDisabled = false,
        errorMessage = '',
    } = props;

    const handleChange = () => {};
    const handleBlur = () => {};

    return (
        <div className="field p-fluid">
            <label htmlFor={name}>{title}</label>
            <InputText
                id={name}
                type={type ?? 'text'}
                placeholder={placeholder}
                value={value}
                onChange={onChange ?? handleChange}
                onBlur={onBlur ?? handleBlur}
                disabled={isDisabled}
                className={!errorMessage ? '' : 'p-invalid'}
                aria-describedby={`${name}-help`}
            />
            {!errorMessage ? null : (
                <small id={`${name}-help`} className="p-error">
                    {errorMessage}
                </small>
            )}
        </div>
    );
};

export default Input;