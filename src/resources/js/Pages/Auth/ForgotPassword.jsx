import AuthLayout from '@/layouts/AuthLayout';
import { Link, useForm } from '@inertiajs/react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword({ status }) {
    const { t } = useTranslation('auth');
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title={t('resetPassword')}>
            <Card className="auth-card border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">
                    <h5 className="text-center mb-3 fw-bold text-dark">
                        {t('resetPassword')}
                    </h5>

                    <p className="text-muted mb-4 text-center small">
                        {t('forgotPasswordDescription')}
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
                                placeholder={t('email')}
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
                                {processing ? t('sendingResetLink') : t('sendResetLink')}
                            </Button>
                        </div>
                    </Form>

                    <div className="text-center mt-4">
                        <Link
                            href={route('login')}
                            className="text-muted small text-decoration-none"
                        >
                            ← {t('login')}
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </AuthLayout>
    );
}
