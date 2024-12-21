
import { useTranslation } from "react-i18next";
import { useGetAdminEventsQuery } from "../../entities/event/api/eventsApi";
import defPic from '../../../../dbimages/placeholder.png'
import { useNavigate } from "react-router-dom";

const AdminHomePage = () => {
  const {isLoading, data, isError} = useGetAdminEventsQuery()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const handleCardClick = (eventId: number) => {
    navigate(`/dashboard/${eventId}`); // Переход на страницу с детализированной информацией о событии
  };

  return (
    <div className="container">
      <div className="home-wrapper">
        <h2>{i18n.t('pageInfo.events')}</h2>
        {isLoading && <div>{i18n.t('pageInfo.loading')}</div>}
        {isError && <div>Ошибка при загрузке</div>}
        {data?.events.length === 0 ? (
          <p>События не найдены</p>
        ) : (
          data?.events.map((event, index) => (
            <div key={index} onClick={() => handleCardClick(event.event_id)} className="eventCard">
              <img 
                // width={300}
                className="eventPreview"
                src={event.event_preview? `data:image/jpeg;base64,${event.event_preview}` : defPic} 
                alt="Event preview" />
              <div className="eventCardBox">
                <div className="eventCardBox-left">
                  <div className="eventName">{event.event_name}</div>
                  <div className="eventDescription">{event.event_description}</div>
                </div>
                <div className="eventCardBox-right">
                  <div className="eventTicketPrice">{event.event_price} {i18n.t('pageInfo.soms')}</div>
                  <div className="eventTicketDate">{event.event_date}</div>
                  <div className="eventTicketTime">{event.event_start_time} {event.event_end_time &&` - ${event.event_end_time}`}</div>
                  <div className="eventCard__btns">
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
