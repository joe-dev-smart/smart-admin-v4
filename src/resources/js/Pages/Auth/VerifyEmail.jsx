import AuthLayout from '@/layouts/AuthLayout';
import { Link, useForm } from '@inertiajs/react';
import { Button, Alert, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function VerifyEmail({ status }) {
    const { t } = useTranslation('auth');
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout title={t('verifyEmail')}>
            <Card className="auth-card border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">
                    <h5 className="text-center mb-3 fw-bold text-dark">
                        {t('verifyEmail')}
                    </h5>

                    <p className="text-muted mb-4 text-center small">
                        {t('verifyEmailDescription')}
                    </p>

                    {status === 'verification-link-sent' && (
                        <Alert variant="success" className="mb-4">
                            {t('verificationLinkSent')}
                        </Alert>
                    )}

                    <form onSubmit={submit}>
                        <div className="d-grid gap-3">
                            <Button
                                type="submit"
                                className="auth-btn"
                                size="lg"
                                disabled={processing}
                            >
                                {processing ? t('sendingVerification') : t('resendVerification')}
                            </Button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="btn btn-outline-secondary btn-lg"
                            >
                                {t('logout')}
                            </Link>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </AuthLayout>
    );
}
