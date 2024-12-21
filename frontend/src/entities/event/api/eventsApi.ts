import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Event {
    event_id: number;
    event_name: string;
    event_description: string;
    event_date: string;
    event_start_time: string;
    event_end_time: string | null;
    event_preview: string | null;
    event_address: string;
    event_price: number;
}

interface EventsResponse {
    events: Event[];
}

interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    ticket_id: number;
    ticket_status: string;
    booking_date: string;
  }

interface EventUsersResponse {
   users: User[];
 }

export const eventsApi = createApi({
    reducerPath: 'eventsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api/`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token'); // Получаем токен из localStorage
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Events'],
    endpoints: (builder) => ({
        getEvents: builder.query<EventsResponse, string | undefined>({
            query: (searchQuery) => ({
                url: 'events',
                params: searchQuery ? { search: searchQuery }: {}, // передаем параметр поиска
            }),
            providesTags: (result) => 
                result ? [{ type: 'Events' }] : [],
        }),
        createEvent: builder.mutation<Event, FormData>({
            query: (formData) => ({
                url: 'create-event',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [{ type: 'Events' }],
        }),
        getAdminEvents: builder.query<EventsResponse, void>({
            query: () => 'admin-events',
            providesTags: (result) => 
                result ? [{ type: 'Events' }] : [],
        }),
        getEventUsers: builder.query<EventUsersResponse, number>({
            query: (eventId) => `event-users/${eventId}`, 
            providesTags: (result) =>
                result ? [{ type: 'Events' }] : [],
    }),
    }),
});

export const { useGetEventsQuery, useGetAdminEventsQuery, useCreateEventMutation, useGetEventUsersQuery } = eventsApi;
