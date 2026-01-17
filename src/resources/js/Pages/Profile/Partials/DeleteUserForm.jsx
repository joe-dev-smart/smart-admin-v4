import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

export default function DeleteUserForm() {
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
                Once your account is deleted, all of its resources and data will be
                permanently deleted. Before deleting your account, please download any
                data or information that you wish to retain.
            </p>

            <Button variant="danger" onClick={confirmUserDeletion}>
                Delete Account
            </Button>

            <Modal show={showModal} onHide={closeModal} centered>
                <Form onSubmit={deleteUser}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-muted">
                            Are you sure you want to delete your account? Once deleted,
                            all of its resources and data will be permanently deleted.
                            Please enter your password to confirm.
                        </p>

                        <Form.Group className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter your password"
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
                            Cancel
                        </Button>
                        <Button variant="danger" type="submit" disabled={processing}>
                            {processing ? 'Deleting...' : 'Delete Account'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
