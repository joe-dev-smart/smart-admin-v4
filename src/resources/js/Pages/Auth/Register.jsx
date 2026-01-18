import AuthLayout from '@/layouts/AuthLayout';
import { Link, useForm } from '@inertiajs/react';
import { Form, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation('auth');
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title={t('createAccount')}>
            <Card className="auth-card border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">
                    <h5 className="text-center mb-4 fw-bold text-dark">
                        {t('createAccount')}
                    </h5>

                    <Form onSubmit={submit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                                autoFocus
                                isInvalid={!!errors.name}
                                placeholder={t('namePlaceholder')}
                                className="auth-input"
                                size="lg"
                            />
                            {errors.name && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
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

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
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
                            <Form.Control
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                                isInvalid={!!errors.password_confirmation}
                                placeholder={t('confirmPasswordPlaceholder')}
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
                                {processing ? t('registering') : t('registerButton')}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <div className="text-center mt-4">
                <p className="auth-link-text mb-0">
                    {t('hasAccount')}{' '}
                    <Link href={route('login')} className="text-primary fw-semibold">
                        {t('login')}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
