import React from 'react';

interface InputFieldProps {
    name: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    label: string;
    role?: 'admin' | 'user'
}

const InputField: React.FC<InputFieldProps> = ({
    name,
    type,
    placeholder,
    value,
    onChange,
    required,
    label,
    role
}) => {
    return (
        <div className="input-field">
            <label htmlFor={name} className="input-field__label">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="auth-form__input"
                maxLength={
                    name === 'phone_number'
                        ? 13
                        : name === 'first_name' || name === 'last_name'
                        ? 30
                        : name === 'email' || name === 'password'
                        ? 50
                        : undefined
                }
            />
        </div>
    );
};

export default InputField;
