import AuthLayout from '@/layouts/AuthLayout';
import { useForm } from '@inertiajs/react';
import { Form, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function ConfirmPassword() {
    const { t } = useTranslation('auth');
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title={t('confirmPasswordTitle')}>
            <Card className="auth-card border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">
                    <h5 className="text-center mb-3 fw-bold text-dark">
                        {t('confirmPasswordTitle')}
                    </h5>

                    <p className="text-muted mb-4 text-center small">
                        {t('confirmPasswordDescription')}
                    </p>

                    <Form onSubmit={submit}>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoFocus
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

                        <div className="d-grid">
                            <Button
                                type="submit"
                                className="auth-btn"
                                size="lg"
                                disabled={processing}
                            >
                                {processing ? t('confirming') : t('confirmButton')}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </AuthLayout>
    );
}
