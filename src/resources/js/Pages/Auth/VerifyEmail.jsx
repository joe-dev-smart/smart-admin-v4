import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Alert } from 'react-bootstrap';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <h5 className="text-center mb-4">Verify Email</h5>

            <p className="text-muted mb-4">
                Thanks for signing up! Before getting started, could you verify your
                email address by clicking on the link we just emailed to you?
            </p>

            {status === 'verification-link-sent' && (
                <Alert variant="success" className="mb-3">
                    A new verification link has been sent to your email address.
                </Alert>
            )}

            <form onSubmit={submit}>
                <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" disabled={processing}>
                        {processing ? 'Sending...' : 'Resend Verification Email'}
                    </Button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="btn btn-outline-secondary"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
