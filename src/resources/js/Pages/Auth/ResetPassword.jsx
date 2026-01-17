import AuthLayout from '@/layouts/AuthLayout';
import { useForm } from '@inertiajs/react';
import { Form, Button, Card } from 'react-bootstrap';
import { auth } from '@/config/labels';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title={auth.resetPassword}>
            <Card className="auth-card border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">
                    <h5 className="text-center mb-4 fw-bold text-dark">
                        {auth.resetPassword}
                    </h5>

                    <Form onSubmit={submit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                isInvalid={!!errors.email}
                                placeholder={auth.email}
                                className="auth-input"
                                size="lg"
                            />
                            {errors.email && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                                autoFocus
                                isInvalid={!!errors.password}
                                placeholder={auth.newPasswordPlaceholder}
                                className="auth-input"
                                size="lg"
                            />
                            {errors.password && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Control
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                                isInvalid={!!errors.password_confirmation}
                                placeholder={auth.confirmPasswordPlaceholder}
                                className="auth-input"
                                size="lg"
                            />
                            {errors.password_confirmation && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.password_confirmation}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <div className="d-grid">
                            <Button
                                type="submit"
                                className="auth-btn"
                                size="lg"
                                disabled={processing}
                            >
                                {processing ? auth.resettingPassword : auth.resetPasswordButton}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </AuthLayout>
    );
}
