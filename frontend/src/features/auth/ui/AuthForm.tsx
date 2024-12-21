import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthForm from '../hooks/useAuthForm';
import InputField from './InputField';
import './AuthForm.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setAuthMode, setUserRole } from '../model/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { adminRegisterFields, loginFields, registerFields } from '../constants/inputFields';
import { setMessage } from '../../../shared/notify/model/notifySlice';
import { loginAdmin, loginUser, registerAdmin, registerUser } from '../api/authApi';
import { validateCompanyName, validateEmail, validateName, validatePassword, validatePhoneNumber } from '../api/validation';
import { selectUserRole } from '../model/authSelectors';

const AuthForm = () => {
    const { i18n } = useTranslation();
    const selectedUserRole = useAppSelector(selectUserRole)
    const { formData, setFormData, handleChange, mode } = useAuthForm(selectedUserRole);
    const dispatch = useAppDispatch();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const currentFields = mode === 'register' 
        ? (selectedUserRole === 'admin' ? adminRegisterFields : registerFields) 
        : loginFields;
        const isFormValid = currentFields.every(({ name }) => formData[name]?.trim() !== "");

        if (!isFormValid) {
            dispatch(setMessage({ messageColor: 'red', messageText: 'Заполните Все Поля!' }));
            return;
        }
        if (mode === 'register' && selectedUserRole === 'user') {
            const { first_name, last_name, phone_number, email, password } = formData;

            if (!validateName(first_name) || !validateName(last_name)) {
                dispatch(
                    setMessage({ messageColor: 'red', messageText: 'Имя и фамилия должны начинаться с большой буквы и содержать минимум 3 символа.' }),
                );
                return;
            }

            if (!validatePhoneNumber(phone_number)) {
                dispatch(setMessage({ messageColor: 'red', messageText: 'Введите номер в формате +996 XXX XXX XXX.' }));
                return;
            }

            if (!validateEmail(email)) {
                dispatch(setMessage({ messageColor: 'red', messageText: 'Введите корректный email.' }));
                return;
            }

            if (!validatePassword(password)) {
                dispatch(setMessage({ messageColor: 'red', messageText: 'Пароль должен содержать минимум 8 символов, включать заглавные буквы, цифры и спецсимволы.' }));
                return;
            }
        }
        else if(mode === 'register' && selectedUserRole === 'admin'){
            const { company_name, phone_number, email, password } = formData;
            
            if (!validateCompanyName(company_name)) {
                dispatch(
                    setMessage({ messageColor: 'red', messageText: 'Компания должна содержать хотябы 2 символа.' }),
                );
                return;
            }

            if (!validatePhoneNumber(phone_number)) {
                dispatch(setMessage({ messageColor: 'red', messageText: 'Введите номер в формате +996 XXX XXX XXX.' }));
                return;
            }

            if (!validateEmail(email)) {
                dispatch(setMessage({ messageColor: 'red', messageText: 'Введите корректный email.' }));
                return;
            }

            if (!validatePassword(password)) {
                dispatch(setMessage({ messageColor: 'red', messageText: 'Пароль должен содержать минимум 8 символов, включать заглавные буквы, цифры и спецсимволы.' }));
                return;
            }
        }
        else {
            const { email, password } = formData;
        
        if (!email || !email.trim()) {
            dispatch(setMessage({ messageColor: 'red', messageText: 'Пожалуйста, введите email.' }));
            return;
        }
        if (!validateEmail(email)) {
            dispatch(setMessage({ messageColor: 'red', messageText: 'Введите корректный email.' }));
            return;
        }

        if (!password || !password.trim()) {
            dispatch(setMessage({ messageColor: 'red', messageText: 'Пожалуйста, введите пароль.' }));
            return;
        }
        }
        try {
            if (mode === 'register' && selectedUserRole === 'user') {
                const userData = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone_number: formData.phone_number,
                    email: formData.email,
                    password: formData.password,
                };
                const result = await registerUser(userData, dispatch); 
                if (result) {
                    dispatch(setMessage({ messageColor: 'green', messageText: 'Регистрация успешна!' }));
                }
            }
            else if(mode === 'register' && selectedUserRole === 'admin') {
                const userData = {
                    company_name: formData.company_name,
                    phone_number: formData.phone_number,
                    email: formData.email,
                    password: formData.password,
                };
                const result = await registerAdmin(userData, dispatch)
                if (result) {
                    dispatch(setMessage({messageColor: 'green', messageText: 'Регистрация успешна с вами скоро свяжутся!'}))
                }
            }
            else if (mode === 'login' && selectedUserRole === 'user') {
                const credentials = {
                    email: formData.email,
                    password: formData.password,
                };
                
                const result = await loginUser(credentials, dispatch);
                if (result) {
                    dispatch(setMessage({ messageColor: 'green', messageText: 'Вход успешен!' }));
                }
            }
            else {
                const credentials = {
                    email: formData.email,
                    password: formData.password,
                };
                const result = await loginAdmin(credentials, dispatch)
                if (result) {
                    dispatch(setMessage({messageColor: 'green', messageText: 'Вход в Панель Организатора Успешен!'}))
                }
            }
        } catch (error) {
            // console.log(error);
        }
    };

    const fieldsToRender = mode === 'register' 
    ? (selectedUserRole === 'admin' ? adminRegisterFields : registerFields) 
    : loginFields;
    useEffect(() => {
        setFormData({}); // Устанавливаем начальное пустое состояние
    }, [mode]);
    return (
        <form noValidate autoComplete='off' className="auth-form" onSubmit={handleSubmit}>
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="auth-form__h1"
            >
                {i18n.t('form.formH1')}
            </motion.h2>
            <div className="auth-form__inputs">
                <AnimatePresence>
                    {fieldsToRender.map(({ name, type, placeholder, label }, index) => (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <InputField
                                name={name}
                                type={type}
                                placeholder={placeholder}
                                value={formData[name as keyof typeof formData] || ''}
                                onChange={handleChange}
                                required={mode === 'register'}
                                label={label}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
                <div className="how-auth__text">
                    {mode === 'login' ? i18n.t('form.howToSignIn'): i18n.t('form.howToSignUp')}
                </div>
            <div className="auth-form__toggle-auth">
                <div className={`toggle-auth__btn ${selectedUserRole === 'user' ? 'selected': ''}`} onClick={() => dispatch(setUserRole('user'))}>Гость</div>
                <div className={`toggle-auth__btn ${selectedUserRole === 'admin' ? 'selected': ''}`} onClick={() => dispatch(setUserRole('admin'))}>Организатор</div>
            </div>
            <motion.button
                className="auth-form__button"
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {mode === 'register' ? i18n.t('form.submitRegBtn') : i18n.t('form.submitLogBtn')}
            </motion.button>
            <motion.div
                className="auth-form__toggle-mode"
                onClick={() => dispatch(setAuthMode(mode === 'register' ? 'login' : 'register'))}
                whileHover={{ scale: 1.1, color: '#ffffff' }}
            >
                {mode === 'register' ? i18n.t('form.accountLogPrompt') : i18n.t('form.accountRegPrompt')}
            </motion.div>
        </form>
    );
};

export default AuthForm;
