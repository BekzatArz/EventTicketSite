import { useAppSelector } from '../../../store/hooks';
import { selectNotify } from '../model/notifySelector';
import { motion, AnimatePresence } from 'framer-motion';
import '../Notify.css';
import { useEffect, useState } from 'react';

const Notify = () => {
    const notifyMessage = useAppSelector(selectNotify);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notifyMessage?.messageText) {
            setIsVisible(true); // Показываем уведомление
            const timer = setTimeout(() => {
                setIsVisible(false); // Скрываем уведомление через 3 секунды
            }, 3000);

            // Очищаем таймер при размонтировании компонента
            return () => clearTimeout(timer);
        }
    }, [notifyMessage]); // Следим за изменениями в сообщении

    const messageColor = notifyMessage?.messageColor || 'black';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="notify"
                    style={{ backgroundColor: messageColor }}
                    initial={{ opacity: 0, x: '100%' }}  // Начало с правой стороны
                    animate={{ opacity: 1, x: '-2%'}}       // Перемещение влево
                    exit={{ opacity: 0, x: '100%' }}     // Перемещение вправо при исчезновении
                    transition={{
                        duration: 0.5,              // Плавное изменение видимости и перемещения
                    }}
                >
                    Внимание: {notifyMessage?.messageText}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notify;
