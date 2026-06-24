import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Button, Alert } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

export default function UsersEdit({ user, roles, stores, userStores }) {
    const { t } = useTranslation(['users', 'common']);
    const { auth } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role_id: user.role_id || '',
        is_active: user.is_active ?? true,
        stores: userStores || [],
    });

    const isOwnAccount = user.id === auth.user.id;
    const isSuperAdmin = user.role?.slug === 'super-admin';

    const handleStoreChange = (storeId, checked) => {
        if (checked) {
            setData('stores', [...data.stores, storeId]);
        } else {
            setData('stores', data.stores.filter(id => id !== storeId));
        }
    };

    const handleSelectAllStores = (checked) => {
        if (checked) {
            setData('stores', stores.map(s => s.id));
        } else {
            setData('stores', []);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <MainLayout>
            <Head title={t('users:editUser')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('users:editUser')}
                    subtitle={user.name}
                    backRoute={route('users.index')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('users:title'), href: route('users.index') },
                        { label: t('users:editUser') },
                    ]}
                />

                {isOwnAccount && (
                    <Alert variant="info" className="mb-4">
                        {t('users:editingOwnAccount')}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('users:sections.basicInfo')}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('users:fields.name')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('users:placeholders.name')}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('users:fields.username')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            placeholder={t('users:placeholders.username')}
                                            isInvalid={!!errors.username}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('users:fields.email')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder={t('users:placeholders.email')}
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('users:fields.role')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={data.role_id}
                                            onChange={(e) => setData('role_id', e.target.value)}
                                            isInvalid={!!errors.role_id}
                                            disabled={isOwnAccount && isSuperAdmin}
                                        >
                                            <option value="">{t('users:placeholders.role')}</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.role_id}
                                        </Form.Control.Feedback>
                                        {isOwnAccount && isSuperAdmin && (
                                            <Form.Text className="text-muted">
                                                {t('users:cannotChangeOwnRole')}
                                            </Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Password */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('users:sections.password')}</h5>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted mb-3">{t('users:passwordChangeHint')}</p>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('users:fields.newPassword')}</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder={t('users:placeholders.newPassword')}
                                            isInvalid={!!errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('users:fields.passwordConfirmation')}</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder={t('users:placeholders.passwordConfirmation')}
                                            isInvalid={!!errors.password_confirmation}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password_confirmation}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Stores Access */}
                    <Card className="mb-4">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">{t('users:sections.storesAccess')}</h5>
                            <Form.Check
                                type="checkbox"
                                id="select-all-stores"
                                label={t('users:selectAllStores')}
                                checked={data.stores.length === stores.length && stores.length > 0}
                                onChange={(e) => handleSelectAllStores(e.target.checked)}
                            />
                        </Card.Header>
                        <Card.Body>
                            {stores.length === 0 ? (
                                <p className="text-muted">{t('users:noStores')}</p>
                            ) : (
                                <Row>
                                    {stores.map((store) => (
                                        <Col md={4} key={store.id} className="mb-2">
                                            <Form.Check
                                                type="checkbox"
                                                id={`store-${store.id}`}
                                                label={store.name}
                                                checked={data.stores.includes(store.id)}
                                                onChange={(e) => handleStoreChange(store.id, e.target.checked)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Status */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('users:sections.status')}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form.Check
                                type="switch"
                                id="is_active"
                                label={t('users:fields.isActive')}
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                disabled={isOwnAccount}
                            />
                            {isOwnAccount && (
                                <Form.Text className="text-muted">
                                    {t('users:cannotDeactivateOwnAccount')}
                                </Form.Text>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Form Actions */}
                    <div className="d-flex justify-content-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => window.history.back()}
                            disabled={processing}
                        >
                            {t('common:actions.cancel')}
                        </Button>
                        <Button type="submit" variant="primary" disabled={processing}>
                            {processing ? t('common:actions.saving') : t('common:actions.save')}
                        </Button>
                    </div>
                </Form>
            </div>
        </MainLayout>
    );
}
