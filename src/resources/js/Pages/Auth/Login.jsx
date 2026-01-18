import AuthLayout from '@/layouts/AuthLayout';
import { Link, useForm } from '@inertiajs/react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function Login({ status, canResetPassword }) {
    const { t } = useTranslation('auth');
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title={t('login')}>
            <Card className="auth-card border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">
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
                                autoComplete="username"
                                autoFocus
                                isInvalid={!!errors.email}
                                placeholder={t('emailPlaceholder')}
                                className="auth-input"
                                size="lg"
                            />
                            {errors.email && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Control
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="current-password"
                                isInvalid={!!errors.password}
                                placeholder={t('passwordPlaceholder')}
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
                            <Form.Check
                                type="checkbox"
                                id="remember"
                                label={t('rememberMe')}
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="auth-checkbox"
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button
                                type="submit"
                                className="auth-btn"
                                size="lg"
                                disabled={processing}
                            >
                                {processing ? t('loggingIn') : t('loginButton')}
                            </Button>
                        </div>

                        {canResetPassword && (
                            <div className="text-center mt-4">
                                <Link
                                    href={route('password.request')}
                                    className="text-muted small text-decoration-none"
                                >
                                    {t('forgotPassword')}
                                </Link>
                            </div>
                        )}
                    </Form>
                </Card.Body>
            </Card>

            <div className="text-center mt-4 d-lg-none">
                <p className="text-muted mb-0">
                    {t('noAccount')}{' '}
                    <Link href={route('register')} className="text-primary fw-semibold">
                        {t('register')}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
