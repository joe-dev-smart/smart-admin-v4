import { Link, useForm, usePage } from '@inertiajs/react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <div>
            <p className="text-muted mb-4">
                Update your account's profile information and email address.
            </p>

            <Form onSubmit={submit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        isInvalid={!!errors.name}
                    />
                    {errors.name && (
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        isInvalid={!!errors.email}
                    />
                    {errors.email && (
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <Alert variant="warning" className="mb-3">
                        Your email address is unverified.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="alert-link"
                        >
                            Click here to re-send the verification email.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-success">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </Alert>
                )}

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
