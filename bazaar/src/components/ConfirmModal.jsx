import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel' }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="confirm-modal-overlay" onClick={onClose}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <button className="confirm-modal-close" onClick={onClose}>
                    <X className="close-icon" />
                </button>

                <div className="confirm-modal-icon">
                    <AlertTriangle className="warning-icon" />
                </div>

                <h3 className="confirm-modal-title">{title}</h3>
                <p className="confirm-modal-message">{message}</p>

                <div className="confirm-modal-actions">
                    <button
                        onClick={onClose}
                        className="confirm-modal-btn confirm-cancel-btn"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="confirm-modal-btn confirm-delete-btn"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
