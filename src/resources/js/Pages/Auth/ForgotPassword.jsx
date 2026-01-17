import GuestLayout from '@/layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <h5 className="text-center mb-4">Forgot Password</h5>

            <p className="text-muted mb-4 text-center">
                Enter your email address and we will send you a password reset link.
            </p>

            {status && (
                <Alert variant="success" className="mb-3">
                    {status}
                </Alert>
            )}

            <Form onSubmit={submit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoFocus
                        isInvalid={!!errors.email}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <div className="d-grid">
                    <Button type="submit" variant="primary" disabled={processing}>
                        {processing ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </div>
            </Form>
        </GuestLayout>
    );
}
