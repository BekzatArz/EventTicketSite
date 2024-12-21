import { createSlice } from "@reduxjs/toolkit";

interface PopupInitialTypes {
    isOpenPopup: boolean,
}

const initialState:PopupInitialTypes = {
    isOpenPopup: false,
}

const popupSlice = createSlice({
    name: 'popup',
    initialState: initialState,
    reducers: {
        openPopup: (state) => {
            state.isOpenPopup = true
        },
        closePopup: (state) => {
            state.isOpenPopup = false
        }
    }
})

export const {openPopup, closePopup} = popupSlice.actions
export default popupSlice.reducer