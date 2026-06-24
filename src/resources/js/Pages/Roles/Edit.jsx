import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Button, Alert } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

export default function RolesEdit({ role, groupedPermissions, rolePermissions, availableRoutes }) {
    const { t } = useTranslation(['roles', 'common']);

    const { data, setData, put, processing, errors } = useForm({
        name: role.name || '',
        description: role.description || '',
        redirect_route: role.redirect_route || 'dashboard',
        permissions: rolePermissions || [],
    });

    const handlePermissionChange = (permissionId, checked) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId]);
        } else {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        }
    };

    const handleModuleSelectAll = (modulePermissions, checked) => {
        const modulePermissionIds = modulePermissions.map(p => p.id);
        if (checked) {
            const newPermissions = [...new Set([...data.permissions, ...modulePermissionIds])];
            setData('permissions', newPermissions);
        } else {
            setData('permissions', data.permissions.filter(id => !modulePermissionIds.includes(id)));
        }
    };

    const isModuleFullySelected = (modulePermissions) => {
        return modulePermissions.every(p => data.permissions.includes(p.id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    return (
        <MainLayout>
            <Head title={t('roles:editRole')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('roles:editRole')}
                    subtitle={role.name}
                    backRoute={route('roles.index')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('roles:title'), href: route('roles.index') },
                        { label: t('roles:editRole') },
                    ]}
                />

                {role.is_system && (
                    <Alert variant="warning" className="mb-4">
                        {t('roles:systemRoleWarning')}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('roles:sections.basicInfo')}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('roles:fields.name')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('roles:placeholders.name')}
                                            isInvalid={!!errors.name}
                                            readOnly={role.is_system}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('roles:fields.description')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={t('roles:placeholders.description')}
                                            isInvalid={!!errors.description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('roles:fields.redirectRoute')}</Form.Label>
                                        <Form.Select
                                            value={data.redirect_route}
                                            onChange={(e) => setData('redirect_route', e.target.value)}
                                            isInvalid={!!errors.redirect_route}
                                        >
                                            {availableRoutes.map((route) => (
                                                <option key={route.value} value={route.value}>
                                                    {route.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Text className="text-muted">
                                            {t('roles:redirectRouteHelp')}
                                        </Form.Text>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.redirect_route}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Permissions */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('roles:sections.permissions')}</h5>
                        </Card.Header>
                        <Card.Body>
                            {role.slug === 'super-admin' ? (
                                <Alert variant="info">
                                    {t('roles:superAdminAllPermissions')}
                                </Alert>
                            ) : Object.keys(groupedPermissions).length === 0 ? (
                                <p className="text-muted">{t('roles:noPermissions')}</p>
                            ) : (
                                <Row>
                                    {Object.entries(groupedPermissions).map(([module, permissions]) => (
                                        <Col md={4} key={module} className="mb-4">
                                            <Card className="h-100">
                                                <Card.Header className="bg-light py-2">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id={`module-${module}`}
                                                        label={<strong className="text-capitalize">{t(`roles:modules.${module}`, module)}</strong>}
                                                        checked={isModuleFullySelected(permissions)}
                                                        onChange={(e) => handleModuleSelectAll(permissions, e.target.checked)}
                                                    />
                                                </Card.Header>
                                                <Card.Body className="py-2">
                                                    {permissions.map((permission) => (
                                                        <Form.Check
                                                            key={permission.id}
                                                            type="checkbox"
                                                            id={`permission-${permission.id}`}
                                                            label={t(`roles:actions.${permission.action}`, permission.action)}
                                                            checked={data.permissions.includes(permission.id)}
                                                            onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                            className="mb-1"
                                                        />
                                                    ))}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
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
