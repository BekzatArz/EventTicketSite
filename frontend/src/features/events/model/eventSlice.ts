import { createSlice } from "@reduxjs/toolkit";
type EventsType = {
    event_name: string;
    event_description: string;
    event_date: string;
    event_start_time: string;
    event_end_time: string | null;
    event_preview: string | null;
}

interface EventSliceType {
    events: EventsType[]
}

const initialState:EventSliceType = {
    events: [],
}
const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        
    }
})

export const {} = eventSlice.actions
export default eventSlice.reducer