import { useParams } from "react-router-dom";
import { useGetEventUsersQuery } from "../../entities/event/api/eventsApi";
import { useState, useEffect, useMemo } from "react";
import '../styles/EventDashboard.css';
import { useChangeStatusMutation } from "../../entities/ticket/api/ticketsApi";
import { useAppDispatch } from "../../store/hooks";
import { setMessage } from "../../shared/notify/model/notifySlice";

const EventDashboard = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useGetEventUsersQuery(Number(id));
  const [changeStatus] = useChangeStatusMutation();
  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'canceled'>('pending'); // Explicit type for activeTab

  const statusMapping: { [key: string]: string } = {
    pending: 'Ожидает',
    confirmed: 'Забронирован',
    canceled: 'Отказано',
  };

  const reverseStatusMapping: { [key: string]: string } = {
    'Ожидает': 'pending',
    'Забронирован': 'confirmed',
    'Отказано': 'canceled',
  };

  useEffect(() => {
    if (!isLoading && data?.users) {
      const initialStatuses = data.users.reduce((acc, user) => {
        acc[user.ticket_id] = statusMapping[user.ticket_status] || "Ожидает";
        return acc;
      }, {} as { [key: number]: string });
      setSelectedStatus(initialStatuses);
    }
  }, [isLoading, data]);

  const handleStatusChange = (ticketId: number, status: string) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [ticketId]: status,
    }));
  };

  const handleChangeStatus = (ticketId: number) => {
    const statusInRussian = selectedStatus[ticketId];
    const statusInEnglish = reverseStatusMapping[statusInRussian];

    if (!statusInEnglish) {
      console.error('Невалидный статус');
      return;
    }

    changeStatus({ ticket_id: ticketId, status: statusInEnglish })
      .unwrap()
      .then(() => {
        dispatch(setMessage({ messageColor: 'green', messageText: 'Статус успешно изменен' }));
        refetch()
      })
      .catch((error) => {
        dispatch(setMessage({ messageColor: 'red', messageText: `Ошибка при изменении статуса: ${error}` }));
      });
  };

  const userSections = useMemo(() => ({
    pending: Array.isArray(data?.users)
      ? data.users.filter(user => user.ticket_status === 'pending').sort(
          (a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
        )
      : [],
    confirmed: Array.isArray(data?.users)
      ? data.users.filter(user => user.ticket_status === 'confirmed').sort(
          (a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
        )
      : [],
    canceled: Array.isArray(data?.users)
      ? data.users.filter(user => user.ticket_status === 'canceled').sort(
          (a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
        )
      : [],
  }), [data?.users]);
  return (
    <div className="container">
      <h2 style={{textAlign: 'center', marginTop: '20px'}}>Панель управления событием</h2>
      {isLoading && <div>Загрузка...</div>}
      {isError && <div>Ошибка при загрузке пользователей</div>}
      {data?.users && data.users.length === 0 ? (
        <p>Для этого события нет пользователей</p>
      ) : (
        <div className="eventDashboardContainer">
          <div className="tabButtons">
            {['pending', 'confirmed', 'canceled'].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? 'eventUsersActive' : ''}
                onClick={() => setActiveTab(tab as 'pending' | 'confirmed' | 'canceled')} // Cast to specific tab type
              >
                {statusMapping[tab]}
              </button>
            ))}
          </div>

          <div className="userListContainer">
            {userSections[activeTab]?.length === 0 ? (
              <p style={{fontWeight: '500', textAlign: 'center', marginTop: '30px'}}>Пусто</p>
            ) : (
              userSections[activeTab].map((user) => (
                <div key={user.user_id} className="userCard">
                  <div className="user_name">
                    <div>{user.first_name}</div>
                    <div>{user.last_name}</div>
                  </div>
                  <div>{user.email}</div>
                  <div>{user.phone_number}</div>
                  <div>Дата бронирования: {new Date(user.booking_date).toLocaleDateString()}</div>
                  <div className="userStatus">
                    Статус:
                    <select
                      value={selectedStatus[user.ticket_id] || "Ожидает"}
                      onChange={(e) => handleStatusChange(user.ticket_id, e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="Ожидает">Ожидает</option>
                      <option value="Забронирован">Забронирован</option>
                      <option value="Отказано">Отказано</option>
                    </select>
                    <button onClick={() => handleChangeStatus(user.ticket_id)}>
                      Изменить статус
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDashboard;
