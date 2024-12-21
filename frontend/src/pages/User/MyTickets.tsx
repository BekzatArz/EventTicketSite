import '../../entities/ticket/ui/MyTickets.css';
import { useGetMyTicketsQuery } from '../../entities/ticket/api/ticketsApi';
import defPic from '../../../../dbimages/placeholder.png';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectIsOpenPopup } from '../../shared/popup/model/selectorPopup';
import { closePopup, openPopup } from '../../shared/popup/model/popupSlice';
import Popup from '../../shared/popup/ui/Popup';
import '../styles/MyTickets.css'

interface TicketType {
  event_id: number;
  event_name: string;
  event_description: string;
  event_date: string;
  event_start_time: string | null;
  event_end_time: string | null;
  event_price: number;
  event_address: string;
  ticket_status: string;
  event_preview: string | null;
}

const MyTickets: React.FC = () => {
  const { data, error, isLoading } = useGetMyTicketsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useAppDispatch();
  const isOpenPopup = useAppSelector(selectIsOpenPopup);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  const handleCardClick = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    dispatch(openPopup());
  };

  const handleClosePopup = () => {
    dispatch(closePopup());
    setSelectedTicket(null);
  };

  if (isLoading) return <div className="container">Загрузка...</div>;
  if (error) {
    const errorMessage =
      'status' in error
        ? `Ошибка сети: ${error.status} - ${error.data ? JSON.stringify(error.data) : 'Нет данных'}`
        : 'Произошла неизвестная ошибка';
    return <div>Произошла ошибка: {errorMessage}</div>;
  }

  const eventsToDisplay = data?.tickets || [];
  if (eventsToDisplay.length === 0) {
    return <div className="container">У вас нет билетов.</div>;
  }

  return (
    <div className="container">
      {isOpenPopup && selectedTicket && (
        <Popup onClose={handleClosePopup}>
          <div className="popup-book-content">
            <div className="popup-book-wrapper">Информация о событии</div>
            <div className="popup-book-name">{selectedTicket.event_name}</div>
            <div className="popup-book-description">{selectedTicket.event_description}</div>
            <div className="popup-book-details">
              <p>Дата: {selectedTicket.event_date}</p>
              <p>
                Время: {selectedTicket.event_start_time}{' '}
                {selectedTicket.event_end_time && ` - ${selectedTicket.event_end_time}`}
              </p>
              <p>Адрес: {selectedTicket.event_address}</p>
              <p>Цена: {selectedTicket.event_price} C</p>
              <p>
                Статус:{' '}
                {selectedTicket.ticket_status === 'pending' && 'Ожидает подтверждения'}
                {selectedTicket.ticket_status === 'confirmed' && 'Подтвержден'}
                {selectedTicket.ticket_status === 'canceled' && 'Отменен'}
              </p>
            </div>
          </div>
        </Popup>
      )}

      <div className="home-wrapper">
        {eventsToDisplay.map((ticket) => (
          <div
            key={ticket.event_id}
            className="eventCard"
            onClick={() => handleCardClick(ticket)} // Добавляем обработчик клика
          >
            <img
              width={300}
              className="eventPreview"
              src={ticket.event_preview ? `data:image/jpeg;base64,${ticket.event_preview}` : defPic}
              alt="Event preview"
            />
            <div className="eventCardBox">
              <div className="eventCardBox-left">
                <div className="eventName">{ticket.event_name}</div>
                <div className="eventDescription">{ticket.event_description}</div>
              </div>
              <div className="eventCardBox-right">
                <div className="eventTicketPrice">{ticket.event_price} C</div>
                <div className="eventTicketDate">{ticket.event_date}</div>
                <div className="eventTicketTime">
                  {ticket.event_start_time} {ticket.event_end_time && ` - ${ticket.event_end_time}`}
                </div>
                <div
                className={`event__ticketStatus ${
                  ticket.ticket_status === 'pending'
                    ? 'event__ticketStatus--pending'
                    : ticket.ticket_status === 'confirmed'
                    ? 'event__ticketStatus--confirmed'
                    : 'event__ticketStatus--canceled'
                }`}
              >
                {ticket.ticket_status === 'pending' && 'Ожидает подтверждения'}
                {ticket.ticket_status === 'confirmed' && 'Подтвержден'}
                {ticket.ticket_status === 'canceled' && 'Отменен'}
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
