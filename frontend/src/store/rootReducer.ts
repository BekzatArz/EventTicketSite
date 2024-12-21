import { combineReducers } from "@reduxjs/toolkit";
import authSlice from '../features/auth/model/authSlice'
import notifySlice from '../shared/notify/model/notifySlice'
import popupSlice from "../shared/popup/model/popupSlice";
import { eventsApi } from "../entities/event/api/eventsApi";
import { ticketsApi } from "../entities/ticket/api/ticketsApi";

export const rootReducer = combineReducers({
    auth: authSlice,
    popup: popupSlice,
    notify: notifySlice,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [ticketsApi.reducerPath]: ticketsApi.reducer
})