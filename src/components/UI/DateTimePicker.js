// src/components/UI/DateTimePicker.js
import React, { useState } from 'react';

const DateTimePicker = ({ id, value, onChange, error, minDate }) => {
    const [date, setDate] = useState(value ? value.split('T')[0] : '');
    const [time, setTime] = useState(value ? value.split('T')[1]?.substring(0, 5) : '');

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        if (newDate && time) {
            onChange(`${newDate}T${time}`);
        }
    };

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setTime(newTime);
        if (date && newTime) {
            onChange(`${date}T${newTime}`);
        }
    };

    return (
        <div className="datetime-picker">
            <div className="datetime-inputs">
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className={`date-input ${error ? 'input-error' : ''}`}
                    min={minDate}
                />
                <input
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                    className={`time-input ${error ? 'input-error' : ''}`}
                />
            </div>
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export default DateTimePicker;