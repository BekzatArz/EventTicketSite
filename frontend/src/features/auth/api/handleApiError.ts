import { Dispatch } from '@reduxjs/toolkit';
import { setMessage } from '../../../shared/notify/model/notifySlice';

export const handleApiError = (error: any, dispatch: Dispatch) => {
    // Проверяем, является ли ошибка ответом от сервера
    if (error.response) {
        const { status, data } = error.response;

        // Сопоставление сообщений ошибок
        const dataErrors: Record<string, string> = {
            "Email is already in use": "Электронная почта уже используется",
            "Phone number is already in use": "Номер телефона уже используется",
            "Admin account is not verified": 'Ваш аккаунт еще не подтверждён',
            "Missing data": "Заполните все поля"
        };

        // Локализация сообщения ошибки
        const localizedMessage = dataErrors[data.error] || 'Некорректные данные';

        // Обработка статусов
        switch (status) {
            case 400:
                dispatch(setMessage({ messageColor: 'red', messageText: localizedMessage }));
                break;
            case 403:
                if (data.error === "Admin account is not verified") {
                    dispatch(setMessage({messageColor: 'red', messageText: localizedMessage}))
                }
                break;
            case 401:
            case 404:
                dispatch(setMessage({ messageColor: 'red', messageText: 'Неверная Почта или Пароль' }));
                break;
            default:
                dispatch(setMessage({ messageColor: 'red', messageText: 'Ошибка сервера. Попробуйте позже.' }));
                break;
        }
    } else {
        // Если ошибка не связана с сервером (например, проблема сети)
        dispatch(setMessage({ messageColor: 'red', messageText: 'Ошибка сети. Проверьте подключение.' }));
    }
};
