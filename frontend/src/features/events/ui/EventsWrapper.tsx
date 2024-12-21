import React, { MouseEventHandler, useEffect, useState } from 'react';
import './EventsWrapper.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closePopup, openPopup } from '../../../shared/popup/model/popupSlice';
import defPic from '../../../../../dbimages/placeholder.png';
import Popup from '../../../shared/popup/ui/Popup';
import { useCreateTicketMutation } from '../../../entities/ticket/api/ticketsApi';
import { setMessage } from '../../../shared/notify/model/notifySlice';
import { useTranslation } from 'react-i18next';
import { useGetEventsQuery } from '../../../entities/event/api/eventsApi';
import { selectIsOpenPopup } from '../../../shared/popup/model/selectorPopup';
import SearchEvent from './SearchEvent'; // импортируем компонент поиска

interface EventType {
    event_id: number;
    event_name: string;
    event_description: string;
    event_date: string;
    event_start_time: string | null;
    event_end_time: string | null;
    event_price: number;
    event_address: string;
    event_preview: string | null;
}

type EventsPropsTypes = {
    refetch: () => void;
};

const EventsWrapper: React.FC<EventsPropsTypes> = ({  }) => {
    const [createTicket] = useCreateTicketMutation();
    const { i18n } = useTranslation();
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const dispatch = useAppDispatch();
    const isOpenPopup = useAppSelector(selectIsOpenPopup);

    const { data: eventsData, refetch, isLoading, isError } = useGetEventsQuery(
        debouncedSearchQuery ? debouncedSearchQuery : "", // Пустая строка, если нет запроса
        { skip: false } // Запрос всегда выполняется
      );

    useEffect(() => {
        // Debounce the search input
        const debounceTimer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleClickBook: MouseEventHandler<HTMLButtonElement> = (event) => {
        const selectedEvent = eventsData?.events.find((e) => e.event_name === event.currentTarget.dataset['event_name']);
        setSelectedEvent(selectedEvent || null);
        if (selectedEvent) {
            dispatch(openPopup());
        }
    };

    const handleClosePopup = () => {
        dispatch(closePopup());
        setSelectedEvent(null);
    };

    const handleConfirmClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
        const eventId = event.currentTarget.dataset.event_id;
        const price = event.currentTarget.dataset.price;
        if (eventId) {
            const ticketData = {
                event_id: eventId,
                price: price,
            };
            try {
                await createTicket(ticketData).unwrap();
                refetch();
                dispatch(setMessage({ messageColor: 'green', messageText: i18n.t('notify.bookConfirm') }));
            } catch (error) {
                console.error('Ошибка при создании билета:', error);
            }
            dispatch(closePopup());
            setSelectedEvent(null);
        }
    };

    useEffect(() => {
        if (isOpenPopup) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isOpenPopup]);

    return (
        <div className="home-wrapper">
            <SearchEvent searchQuery={searchQuery} onSearchChange={handleSearchChange} /> {/* Используем компонент поиска */}
            {isOpenPopup && selectedEvent && (
                <Popup onClose={handleClosePopup}>
                    <div className="popup-book-content">
                        <div className="popup-book-wrapper">Подтвердить бронирование?</div>
                        <div className="popup-book-name">{selectedEvent.event_name}</div>
                        <div className="popup-book-description">{selectedEvent.event_description}</div>
                        <button
                            data-price={selectedEvent.event_price}
                            data-event_id={selectedEvent.event_id}
                            onClick={handleConfirmClick}
                            className="popup-book-confirm-btn"
                        >
                            OK
                        </button>
                    </div>
                </Popup>
            )}
            {isLoading ? (
                <div>Загрузка...</div>
            ) : isError ? (
                <div>Произошла ошибка при загрузке событий</div>
            ) : eventsData && eventsData.events.length > 0 ? (
                eventsData.events.map((event) => (
                    <div key={event.event_id} className="eventCard">
                        <img
                            width={300}
                            className="eventPreview"
                            src={event.event_preview ? `data:image/jpeg;base64,${event.event_preview}` : defPic}
                            alt="Event preview"
                        />
                        <div className="eventCardBox">
                            <div className="eventCardBox-left">
                                <div className="eventName">{event.event_name}</div>
                                <div className="eventDescription">{event.event_description}</div>
                            </div>
                            <div className="eventCardBox-right">
                                <div className="eventTicketPrice">{event.event_price} C</div>
                                <div className="eventTicketDate">{event.event_date}</div>
                                <div className="eventTicketTime">
                                    {event.event_start_time} {event.event_end_time && ` - ${event.event_end_time}`}
                                </div>
                                <div className="eventCard__btns">
                                    <button data-event_name={event.event_name} onClick={handleClickBook}>
                                        Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div>Нет доступных событий</div>
            )}
        </div>
    );
};

export default EventsWrapper;
