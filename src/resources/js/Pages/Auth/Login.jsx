import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function Login({ status, canResetPassword }) {
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
        <GuestLayout>
            <Head title="Log in" />

            <h5 className="text-center mb-4">Sign In</h5>

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
                        autoComplete="username"
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

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="current-password"
                        isInvalid={!!errors.password}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check
                        type="checkbox"
                        id="remember"
                        label="Remember me"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-muted small"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="d-grid">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing}
                    >
                        {processing ? 'Signing in...' : 'Sign In'}
                    </Button>
                </div>
            </Form>

            <div className="text-center mt-4">
                <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="text-primary">
                        Register
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
