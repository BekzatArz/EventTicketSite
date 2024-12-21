import { RootState } from "../../../store/store";

export const selectAuthMode = (state: RootState) => state.auth.mode
export const selectUserRole = (state: RootState): 'user' | 'admin' => state.auth.userRole
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthError = (state: RootState) => state.auth.error