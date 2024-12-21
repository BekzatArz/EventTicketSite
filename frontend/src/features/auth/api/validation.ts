export const validateName = (name: string): boolean => {
    const nameRegex = /^[A-ZА-Я][a-zа-я]{2,}$/; // С большой буквы, минимум 3 символа
    return nameRegex.test(name);
};
export const validateCompanyName = (name: string): boolean => {
    const compName = /^[a-zа-я]{2,}$/i;
    return compName.test(name)
}

export const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+996\d{9}$/; // Формат +996 (3 цифры) 6 цифр
    return phoneRegex.test(phone);
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Общий валидный email
    return emailRegex.test(email);
};

export const validatePassword = (password?: string): boolean => {
    if (!password) return false; // Проверка на пустое значение

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password); // Проверка на заглавные буквы
    const hasLowerCase = /[a-z]/.test(password); // Проверка на строчные буквы
    const hasNumbers = /[0-9]/.test(password); // Проверка на цифры
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Проверка на спецсимволы
    const isLongEnough = password.length >= minLength; // Проверка на минимальную длину

    return isLongEnough && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};