import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotifyState {
    message: {messageText: string | null, messageColor: string | null} | null
}

const initialState:NotifyState = {
    message: {messageText: null, messageColor: null}
}

const notifySlice = createSlice({
    name: 'notify',
    initialState: initialState,
    reducers: {
        setMessage: (state, action: PayloadAction<{messageText: string, messageColor: string}>) => {
            state.message = action.payload
        }
    }
})

export const { setMessage } = notifySlice.actions
export default notifySlice.reducer