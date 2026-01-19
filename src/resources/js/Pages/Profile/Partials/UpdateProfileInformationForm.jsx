import { useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

export default function UpdateProfileInformation({ status }) {
    const { t } = useTranslation('profile');
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || '',
            username: user.username || '',
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <div>
            <p className="text-muted mb-4">
                {t('sections.personalInfoDescription')}
            </p>

            <Form onSubmit={submit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('fields.name')} <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder={t('fields.namePlaceholder')}
                                isInvalid={!!errors.name}
                            />
                            {errors.name && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('fields.username')}</Form.Label>
                            <Form.Control
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                autoComplete="username"
                                placeholder={t('fields.usernamePlaceholder')}
                                isInvalid={!!errors.username}
                            />
                            <Form.Text className="text-muted">
                                {t('fields.usernameHelp')}
                            </Form.Text>
                            {errors.username && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.username}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('fields.email')}</Form.Label>
                            <Form.Control
                                type="email"
                                value={user.email}
                                disabled
                                readOnly
                                className="bg-light"
                            />
                            <Form.Text className="text-muted">
                                <i className="ri-lock-line me-1"></i>
                                No editable
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                {status === 'profile-updated' && (
                    <Alert variant="success" className="mb-3">
                        {t('messages.profileUpdated')}
                    </Alert>
                )}

                <div className="d-flex align-items-center gap-3">
                    <Button type="submit" variant="primary" disabled={processing}>
                        {processing ? t('actions.saving') : t('actions.save')}
                    </Button>

                    {recentlySuccessful && (
                        <span className="text-success">{t('actions.saved')}</span>
                    )}
                </div>
            </Form>
        </div>
    );
}
