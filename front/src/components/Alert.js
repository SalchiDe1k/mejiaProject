import React from 'react';

const Alert = ({ message, type, onClose }) => {
    return (
        <div className={`alert ${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="close-button">X</button>
        </div>
    );
};

export default Alert;
