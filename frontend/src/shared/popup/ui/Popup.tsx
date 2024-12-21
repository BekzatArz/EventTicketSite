import React from 'react'
import './Popup.css'

type PopupProps = {
  onClose: () => void;
  children: React.ReactNode; // Пропс для содержимого попапа
};

const Popup:React.FC<PopupProps> = ({onClose, children}) => {
  return (
    <div className="popup" onClick={onClose}>
            <div className="popup__content" onClick={(e) => e.stopPropagation()}>
                <button className="popup__close" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
  )
}

export default Popup