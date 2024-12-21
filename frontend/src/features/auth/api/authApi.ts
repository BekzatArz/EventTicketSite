import { handleApiError } from './handleApiError';
import { Dispatch } from '@reduxjs/toolkit';
import axiosInstance from './axiosConfig';
import { login } from '../model/authSlice';

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (
    userData: { first_name: string; last_name: string; phone_number: string; email: string; password: string },
    dispatch: Dispatch
) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/auth/register`, userData, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        handleApiError(error, dispatch); 
        return null;
    }
};
 
export const loginUser = async (credentials: { email: string; password: string }, dispatch: Dispatch) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/auth/login`, credentials, {headers: {
            "Content-Type": 'application/json'
        }});
        localStorage.setItem('token', response.data.token)
        dispatch(login())
        return response.data;
    } catch (error) {
        handleApiError(error, dispatch);
        return null
    }
};

export const registerAdmin = async (
    adminData: {company_name: string, phone_number: string, email: string, password: string},
    dispatch: Dispatch
) => {
    try{
        const response = await axiosInstance.post(`${API_URL}/auth/register-admin`, adminData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        handleApiError(error, dispatch)
        return null
    }
}

export const loginAdmin = async (credentials: { email: string; password: string }, dispatch: Dispatch) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/auth/login-admin`, credentials, {headers: {
            "Content-Type": 'application/json'
        }});
        localStorage.setItem('token', response.data.token)
        dispatch(login())
        
        return response.data;
    } catch (error) {
        handleApiError(error, dispatch);
        return null
    }
};
