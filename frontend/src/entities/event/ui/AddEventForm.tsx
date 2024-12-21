import React, { useState } from "react";
import { useCreateEventMutation } from "../api/eventsApi";
import "./AddEventForm.css";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../store/hooks";
import { setMessage } from "../../../shared/notify/model/notifySlice";

const AddEventForm = () => {
    const { i18n } = useTranslation()
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState<{
        eventName: string;
        eventDescription: string;
        eventDate: string;
        startTime: string;
        endTime: string | null;
        eventPrice: string;
        eventAddress: string;
        eventPreview: File | null;
    }>({
        eventName: "",
        eventDescription: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        eventPrice: "",
        eventAddress: '',
        eventPreview: null,
    });

    const [createEvent] = useCreateEventMutation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            setFormData((prevState) => ({
                ...prevState,
                eventPreview: files[0],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const eventData = {
            eventName: formData.eventName,
            eventDescription: formData.eventDescription,
            eventDate: formData.eventDate,
            startTime: formData.startTime,
            endTime: formData.endTime || '', // Если нет конца времени, передаем null
            eventPrice: formData.eventPrice,
            eventAddress: formData.eventAddress
        };

        const form = new FormData();
        form.append("event_name", eventData.eventName);
        form.append("event_description", eventData.eventDescription);
        form.append("event_date", eventData.eventDate);
        form.append("start_time", eventData.startTime);
        form.append("end_time", eventData.endTime);
        form.append("event_price", eventData.eventPrice);
        form.append('event_address', eventData.eventAddress)
        if (formData.eventPreview) {
            form.append("file", formData.eventPreview);
        }

        try {
            await createEvent(form).unwrap();
            dispatch(setMessage({messageColor: 'green', messageText: i18n.t('notify.eventCreated')}));
        } catch (error) {
            console.error("Failed to create event:", error);
        }
    };
    return (
        <form noValidate autoComplete="off" className="event-form" onSubmit={handleSubmit}>
            <h1 className="event-form__h1">{i18n.t("addEvent.addEventH1")}</h1>
            <div className="event-form__inputs">
                <div className="form-group">
                    <label htmlFor="eventName">1.{i18n.t("addEvent.eventNameLabel")}</label>
                    <input
                        id="eventName"
                        name="eventName"
                        type="text"
                        placeholder={i18n.t("addEvent.eventNamePlaceholder")}
                        value={formData.eventName}
                        onChange={handleInputChange}
                        required
                        maxLength={190}
                    />
                </div>
            <hr className="event-form__hr"/>
                <div className="form-group">
                    <label htmlFor="eventDescription">2.{i18n.t("addEvent.eventDescriptionLabel")}</label>
                    <textarea
                        id="eventDescription"
                        name="eventDescription"
                        placeholder={i18n.t("addEvent.eventDescriptionPlaceholder")}
                        value={formData.eventDescription}
                        onChange={handleInputChange}
                        required
                        maxLength={1999}
                        rows={5}
                    />
                </div>
                    <hr className="event-form__hr"/>

                <div className="form-group">
                    <label htmlFor="eventPreview">3.{i18n.t("addEvent.eventPreviewLabel")}</label>
                    <input
                        id="eventPreview"
                        name="eventPreview"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <hr className="event-form__hr"/>
                <div className="form-group">
                    <label htmlFor="eventDate">4.{i18n.t("addEvent.eventDateLabel")}</label>
                    <input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <hr className="event-form__hr"/>
                <div className="form-group">
                    <label htmlFor="startTime">5.{i18n.t("addEvent.startTimeLabel")}</label>
                    <input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <hr className="event-form__hr"/>
                <div className="form-group">
                    <label htmlFor="endTime">6.{i18n.t("addEvent.endTimeLabel")}</label>
                    <input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={formData.endTime || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <hr className="event-form__hr" />
                <div className="form-group">
                    <label htmlFor="eventPrice">7.{i18n.t("addEvent.eventPriceLabel")}</label>
                    <input
                        id="eventPrice"
                        name="eventPrice"
                        type="text" // Используем текст для более гибкой обработки
                        placeholder={i18n.t("addEvent.eventPricePlaceholder")}
                        value={formData.eventPrice}
                        maxLength={7} // Максимальная длина для ввода
                        onChange={(e) => {
                            const value = e.target.value;
                        
                            // Проверяем, что введены только цифры
                            if (/^\d*$/.test(value)) {
                                const numericValue = Number(value);
                        
                                // Ограничиваем сумму до 1,000,000
                                if (numericValue <= 1000000) {
                                    handleInputChange(e); // Вызываем функцию с событием
                                }
                            }
                        }}
                    />
                </div>
                <hr className="event-form__hr" />
                <div className="form-group">
                    <label htmlFor="eventName">8.{i18n.t("addEvent.eventAddressLabel")}</label>
                    <input
                        id="eventAddress"
                        name="eventAddress"
                        type="text"
                        placeholder={i18n.t("addEvent.eventAddressPlaceholder")}
                        value={formData.eventAddress}
                        onChange={handleInputChange}
                        required
                        maxLength={190}
                    />
                </div>
            </div>
            <button type="submit" className="event-form__submit">
                {i18n.t("addEvent.submitButton")}
            </button>
        </form>
    );
};

export default AddEventForm;
