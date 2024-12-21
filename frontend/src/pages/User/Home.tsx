    import { useGetEventsQuery } from "../../entities/event/api/eventsApi";
    import EventsWrapper from "../../features/events/ui/EventsWrapper";
    import ScrollOnRefresh from "../../shared/scroll/ScrollOnRefresh";

    const Home = () => {
        const { data, error, isLoading, refetch} = useGetEventsQuery(undefined, {
            refetchOnMountOrArgChange: true, // Перезагружать данные при монтировании компонента
        });

        if (isLoading) return <div className="container">Загрузка...</div>;

        if (error) {
            const errorMessage =
                'status' in error
                    ? `Ошибка сети: ${error.status} - ${error.data ? JSON.stringify(error.data) : 'Нет данных'}`
                    : 'Произошла неизвестная ошибка';
            return <div>Произошла ошибка: {errorMessage}</div>;
        }

        const eventsToDisplay = data?.events || [];
        if (eventsToDisplay.length === 0) {
            return <div className="container">В событиях пусто.</div>; // Показать, что билетов нет
          }
        return ( 
            <>
                <ScrollOnRefresh />
                <div className="container">
                    <EventsWrapper refetch={refetch} events={eventsToDisplay} />
                </div>
            </>
        );
    };

    export default Home;
