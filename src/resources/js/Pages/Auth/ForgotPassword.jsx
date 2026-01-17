import AuthLayout from '@/layouts/AuthLayout';
import { Link, useForm } from '@inertiajs/react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { auth } from '@/config/labels';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title={auth.resetPassword}>
            <Card className="auth-card border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">
                    <h5 className="text-center mb-3 fw-bold text-dark">
                        {auth.resetPassword}
                    </h5>

                    <p className="text-muted mb-4 text-center small">
                        {auth.forgotPasswordDesc}
                    </p>

                    {status && (
                        <Alert variant="success" className="mb-4">
                            {status}
                        </Alert>
                    )}

                    <Form onSubmit={submit}>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoFocus
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

                        <div className="d-grid">
                            <Button
                                type="submit"
                                className="auth-btn"
                                size="lg"
                                disabled={processing}
                            >
                                {processing ? auth.sendingResetLink : auth.sendResetLink}
                            </Button>
                        </div>
                    </Form>

                    <div className="text-center mt-4">
                        <Link
                            href={route('login')}
                            className="text-muted small text-decoration-none"
                        >
                            ← {auth.login}
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </AuthLayout>
    );
}
