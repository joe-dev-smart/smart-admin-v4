import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

export default function DeleteUserForm() {
    const { t } = useTranslation(['profile', 'common']);
    const [showModal, setShowModal] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setShowModal(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setShowModal(false);
        clearErrors();
        reset();
    };

    return (
        <div>
            <p className="text-muted mb-4">
                {t('profile:messages.deleteWarning')}
            </p>

            <Button variant="danger" onClick={confirmUserDeletion}>
                {t('profile:actions.deleteAccount')}
            </Button>

            <Modal show={showModal} onHide={closeModal} centered>
                <Form onSubmit={deleteUser}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('profile:actions.confirmDelete')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-muted">
                            {t('profile:messages.enterPasswordToDelete')}
                        </p>

                        <Form.Group className="mt-3">
                            <Form.Label>{t('auth:password')}</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={t('auth:passwordPlaceholder')}
                                isInvalid={!!errors.password}
                            />
                            {errors.password && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            {t('common:actions.cancel')}
                        </Button>
                        <Button variant="danger" type="submit" disabled={processing}>
                            {processing ? t('profile:actions.deletingAccount') : t('profile:actions.deleteAccount')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
