import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface AuthState {
    isAuthenticated: boolean
    mode: 'register' | "login"
    userRole: 'user' | 'admin'
    error: string | null
} 
const decodeJwt = (): 'user' | 'admin'  => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken: { exp: number, role: string } = jwtDecode(token);
            return decodedToken.role === 'admin' ? 'admin' : 'user';  // Возвращаем роль
        } catch (error) {
            console.error("Invalid token:", error);
            return 'user';  // Если токен некорректный, возвращаем роль 'user' по умолчанию
        }
    }
    return 'user';  // Если токен отсутствует, возвращаем роль 'user'
}
const initialState:AuthState = {
    isAuthenticated: localStorage.getItem('token')? true : false,
    mode: 'register',
    userRole: decodeJwt(),
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setAuthMode: (state, action:PayloadAction<'register' | 'login'>) => {
            state.mode = action.payload
        },
        setUserRole: (state, action:PayloadAction<'user' | 'admin'>) => {
            state.userRole = action.payload
        },
        login: (state) => {
            state.isAuthenticated = true;
            state.error = null;
        },
        logout: (state) => {
            localStorage.removeItem('token'),
            state.isAuthenticated = false
            state.error = null
        },
        setAuthError: (state, action:PayloadAction<string>) => {
            state.error = action.payload
        },
        clearAuthError: (state) => {
            state.error = null
        },
        setAuthenticated: (state, action:PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload
        }
    }
})

export const { setAuthMode, login, logout, setAuthError, setUserRole, clearAuthError, setAuthenticated } = authSlice.actions;
export default authSlice.reducer