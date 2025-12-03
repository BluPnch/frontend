import React from 'react';
interface ErrorModalProps {
    show: boolean;
    message: string;
    onClose: () => void;
}
export const ErrorModal: React.FC<ErrorModalProps> = ({ show, message, onClose }) => {
    return (
        <div className={`modal ${show ? 'show' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Ошибка</h3>
                    <button className="close" onClick={onClose}>×</button>
                </div>
                <div className="alert alert-error">
                    {message}
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-primary" onClick={onClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};