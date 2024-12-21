import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { eventsApi } from "../entities/event/api/eventsApi";
import { ticketsApi } from "../entities/ticket/api/ticketsApi";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([eventsApi.middleware, ticketsApi.middleware])
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store