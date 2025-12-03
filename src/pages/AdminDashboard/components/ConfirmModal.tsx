import React from 'react';

interface ConfirmModalProps {
    show: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                              show,
                                                              title = 'Подтверждение удаления',
                                                              message,
                                                              onConfirm,
                                                              onCancel,
                                                              confirmText = 'Удалить',
                                                              cancelText = 'Отмена'
                                                          }) => {
    return (
        <div className={`modal ${show ? 'show' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close" onClick={onCancel}>×</button>
                </div>

                <div className="modal-body">
                    <p>{message}</p>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};