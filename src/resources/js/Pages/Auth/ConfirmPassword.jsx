import GuestLayout from '@/layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Form, Button } from 'react-bootstrap';

export default function ConfirmPassword() {
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
        <GuestLayout>
            <Head title="Confirm Password" />

            <h5 className="text-center mb-4">Confirm Password</h5>

            <p className="text-muted mb-4">
                This is a secure area. Please confirm your password before continuing.
            </p>

            <Form onSubmit={submit}>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoFocus
                        isInvalid={!!errors.password}
                    />
                    {errors.password && (
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <div className="d-grid">
                    <Button type="submit" variant="primary" disabled={processing}>
                        {processing ? 'Confirming...' : 'Confirm'}
                    </Button>
                </div>
            </Form>
        </GuestLayout>
    );
}
