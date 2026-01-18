import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { IconAlertTriangle } from '@tabler/icons-react';

/**
 * Reusable confirmation modal component
 */
const ConfirmModal = ({
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel,
    cancelLabel,
    variant = 'danger',
    loading = false,
}) => {
    const { t } = useTranslation();

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="d-flex align-items-center gap-2">
                    <IconAlertTriangle className={`text-${variant}`} size={24} />
                    {title || t('messages.confirmDeleteTitle')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="mb-0">{message || t('messages.confirmDelete')}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    {cancelLabel || t('actions.cancel')}
                </Button>
                <Button variant={variant} onClick={onConfirm} disabled={loading}>
                    {loading ? t('actions.processing') : confirmLabel || t('actions.confirm')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;
