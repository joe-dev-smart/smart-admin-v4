import AuthLayout from '@/layouts/AuthLayout';
import { Link, useForm } from '@inertiajs/react';
import { Button, Alert, Card } from 'react-bootstrap';
import { auth } from '@/config/labels';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout title={auth.verifyEmail}>
            <Card className="auth-card border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">
                    <h5 className="text-center mb-3 fw-bold text-dark">
                        {auth.verifyEmail}
                    </h5>

                    <p className="text-muted mb-4 text-center small">
                        {auth.verifyEmailDesc}
                    </p>

                    {status === 'verification-link-sent' && (
                        <Alert variant="success" className="mb-4">
                            {auth.verificationSent}
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
                                {processing ? auth.sendingVerification : auth.resendVerification}
                            </Button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="btn btn-outline-secondary btn-lg"
                            >
                                {auth.logout}
                            </Link>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </AuthLayout>
    );
}
