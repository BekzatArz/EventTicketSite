import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Ticket = {
    event_id: number;
    event_name: string;
    event_description: string;
    event_date: string;
    event_start_time: string;
    event_end_time: string | null;
    event_preview: string | null;
    event_price: number;
    event_address: string;
    ticket_status: string;
    booking_date: string
}

interface TicketResponse {
    tickets: Ticket[];
}

export const ticketsApi = createApi({
    reducerPath: 'ticketsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api/`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Tickets'],
    endpoints: (builder) => ({
        createTicket: builder.mutation({
            query: (eventData) => ({
                url: 'create-ticket',
                method: 'POST',
                body: eventData,
            }),
            invalidatesTags: [{ type: 'Tickets', id: 'LIST' }],
        }),
        getMyTickets: builder.query<TicketResponse, void>({
            query: () => 'my-tickets',
            providesTags: (result) =>
                result?.tickets
                  ? [
                      { type: 'Tickets', id: 'LIST' },
                      ...result.tickets.map((ticket) => ({
                        type: 'Tickets' as const,
                        id: ticket.event_id,
                      })),
                    ]
                  : [{ type: 'Tickets', id: 'LIST' }],
        }),

        changeStatus: builder.mutation({
            query: (data) => ({
                url: 'change-status',
                method: 'POST',
                body: data,
            }),
            // Optionally, you could invalidate a tag for related ticket data here:
            invalidatesTags: [{ type: 'Tickets', id: 'LIST' }],
        }),
    }),
});

export const {
    useCreateTicketMutation,
    useGetMyTicketsQuery,
    useChangeStatusMutation
} = ticketsApi;
