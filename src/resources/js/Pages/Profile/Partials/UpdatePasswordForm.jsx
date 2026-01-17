import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <div>
            <p className="text-muted mb-4">
                Ensure your account is using a long, random password to stay secure.
            </p>

            <Form onSubmit={updatePassword}>
                <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                        type="password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        isInvalid={!!errors.current_password}
                    />
                    {errors.current_password && (
                        <Form.Control.Feedback type="invalid">
                            {errors.current_password}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        isInvalid={!!errors.password}
                    />
                    {errors.password && (
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        isInvalid={!!errors.password_confirmation}
                    />
                    {errors.password_confirmation && (
                        <Form.Control.Feedback type="invalid">
                            {errors.password_confirmation}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <div className="d-flex align-items-center gap-3">
                    <Button type="submit" variant="primary" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>

                    {recentlySuccessful && (
                        <span className="text-success">Saved.</span>
                    )}
                </div>
            </Form>
        </div>
    );
}
