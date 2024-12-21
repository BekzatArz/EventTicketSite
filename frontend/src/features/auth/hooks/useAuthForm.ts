import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectAuthMode } from "../model/authSelectors";
import { setAuthMode } from "../model/authSlice";
import { adminRegisterFields, loginFields, registerFields } from "../constants/inputFields";

const useAuthForm = (role: 'admin' | 'user') => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector(selectAuthMode);

    const initialFields = mode === "register" 
        ? role === "admin" 
            ? adminRegisterFields
            : registerFields 
        : loginFields;
    // Инициализация state только с доступными полями
    const initialFormData = Object.fromEntries(
        initialFields.map((field) => [field.name, ""])
    );

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        setFormData((prevData) => {
            let newValue = value;
    
            switch (name) {
                case 'phone_number':
                    // Удаляем все нецифровые символы и обрезаем длину до 13 символов
                    newValue = value.startsWith('+996') 
                        ? `+996${value.slice(4).replace(/[^0-9]/g, '').slice(0, 9)}`
                        : '+996';
                    break;
                case 'first_name':
                case 'last_name':
                    newValue = value.slice(0, 30); // Обрезаем длину имени и фамилии до 30 символов
                    break;
                case 'company_name':
                    newValue = value.slice(0, 100);
                    break
                case 'email':
                    newValue = value.slice(0, 50); // Обрезаем длину email до 50 символов
                    break;
                case 'password':
                    newValue = value.slice(0, 50); // Обрезаем длину пароля до 50 символов
                    break;
                default:
                    break;
            }
    
            return {
                ...prevData,
                [name]: newValue,
            };
        });
    };
    
    

    const validateForm = (): boolean => {
        const currentFields = mode === "register" ? registerFields : loginFields;
        return currentFields.every(({ name }) => formData[name]?.trim() !== "");
    };

    const toggleMode = () => {
        const newMode = mode === "login" ? "register" : "login";
        dispatch(setAuthMode(newMode));

        // Определяем поля для нового режима
        const newFields = newMode === "register" 
            ? role === "admin" 
                ? adminRegisterFields 
                : registerFields 
            : loginFields;

        setFormData(Object.fromEntries(newFields.map((field) => [field.name, ""])));
    };

    return {
        formData,
        setFormData,
        handleChange,
        validateForm,
        mode,
        toggleMode,
    };
};

export default useAuthForm;