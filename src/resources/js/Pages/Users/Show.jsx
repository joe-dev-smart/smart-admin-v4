import { useState } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Badge, Button, Table } from 'react-bootstrap';
import {
    IconUser,
    IconMail,
    IconAt,
    IconShield,
    IconBuildingStore,
    IconLogin,
    IconLogout,
    IconKey,
    IconCalendar,
    IconDevices,
    IconNetwork,
    IconEdit,
    IconArrowLeft,
} from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, StatusBadge, ConfirmModal } from '@/components/ui';

export default function UsersShow({ user, activeSessions, sessions }) {
    const { t } = useTranslation(['users', 'common']);
    const { auth } = usePage().props;
    const [logoutModal, setLogoutModal] = useState({ show: false });
    const [loggingOut, setLoggingOut] = useState(false);

    const isCurrentUser = user.id === auth.user.id;

    const handleForceLogout = () => {
        setLoggingOut(true);
        router.post(route('users.force-logout', user.id), {}, {
            onSuccess: () => {
                setLogoutModal({ show: false });
            },
            onFinish: () => {
                setLoggingOut(false);
            },
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };

    const InfoItem = ({ icon: Icon, label, value, badge }) => (
        <div className="d-flex align-items-start mb-3">
            <div className="flex-shrink-0 me-3">
                <div className="avatar-sm bg-light rounded d-flex align-items-center justify-content-center">
                    <Icon size={20} className="text-primary" />
                </div>
            </div>
            <div className="flex-grow-1">
                <p className="text-muted mb-1 small">{label}</p>
                {badge ? (
                    badge
                ) : (
                    <p className="mb-0 fw-medium">{value || '-'}</p>
                )}
            </div>
        </div>
    );

    return (
        <MainLayout>
            <Head title={`${t('users:viewUser')} - ${user.name}`} />

            <div className="container-fluid">
                <PageHeader
                    title={t('users:viewUser')}
                    subtitle={user.name}
                    backRoute={route('users.index')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('users:title'), href: route('users.index') },
                        { label: user.name },
                    ]}
                />

                <Row>
                    {/* User Information */}
                    <Col lg={6} className="mb-4">
                        <Card className="h-100">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">{t('users:sections.basicInfo')}</h5>
                                <Link href={route('users.edit', user.id)}>
                                    <Button variant="outline-primary" size="sm">
                                        <IconEdit size={16} className="me-1" />
                                        {t('common:actions.edit')}
                                    </Button>
                                </Link>
                            </Card.Header>
                            <Card.Body>
                                <InfoItem
                                    icon={IconUser}
                                    label={t('users:fields.name')}
                                    value={user.name}
                                />
                                <InfoItem
                                    icon={IconAt}
                                    label={t('users:fields.username')}
                                    value={`@${user.username}`}
                                />
                                <InfoItem
                                    icon={IconMail}
                                    label={t('users:fields.email')}
                                    value={user.email}
                                />
                                <InfoItem
                                    icon={IconShield}
                                    label={t('users:fields.role')}
                                    badge={
                                        <Badge bg={user.role?.slug === 'super-admin' ? 'danger' : 'primary'}>
                                            {user.role?.name || '-'}
                                        </Badge>
                                    }
                                />
                                <InfoItem
                                    icon={IconBuildingStore}
                                    label={t('users:fields.stores')}
                                    badge={
                                        user.stores?.length > 0 ? (
                                            <div className="d-flex flex-wrap gap-1">
                                                {user.stores.map((store) => (
                                                    <Badge key={store.id} bg="secondary">
                                                        {store.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )
                                    }
                                />
                                <div className="d-flex align-items-start">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="avatar-sm bg-light rounded d-flex align-items-center justify-content-center">
                                            <IconCalendar size={20} className="text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="text-muted mb-1 small">{t('users:fields.status')}</p>
                                        <StatusBadge status={user.is_active ? 'enabled' : 'disabled'} />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Activity Information */}
                    <Col lg={6} className="mb-4">
                        <Card className="h-100">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">{t('users:sections.activity')}</h5>
                                {!isCurrentUser && (
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        onClick={() => setLogoutModal({ show: true })}
                                    >
                                        <IconLogout size={16} className="me-1" />
                                        {t('users:actions.forceLogout')}
                                    </Button>
                                )}
                            </Card.Header>
                            <Card.Body>
                                <InfoItem
                                    icon={IconLogin}
                                    label={t('users:activity.lastLogin')}
                                    value={formatDate(user.last_login_at)}
                                />
                                <InfoItem
                                    icon={IconNetwork}
                                    label={t('users:activity.lastLoginIp')}
                                    value={user.last_login_ip}
                                />
                                <InfoItem
                                    icon={IconLogout}
                                    label={t('users:activity.lastLogout')}
                                    value={formatDate(user.last_logout_at)}
                                />
                                <InfoItem
                                    icon={IconKey}
                                    label={t('users:activity.passwordChanged')}
                                    value={formatDate(user.password_changed_at)}
                                />
                                <InfoItem
                                    icon={IconLogin}
                                    label={t('users:activity.loginCount')}
                                    value={user.login_count?.toString() || '0'}
                                />
                                <InfoItem
                                    icon={IconCalendar}
                                    label={t('users:activity.accountCreated')}
                                    value={formatDate(user.created_at)}
                                />
                                <InfoItem
                                    icon={IconDevices}
                                    label={t('users:activity.activeSessions')}
                                    badge={
                                        <Badge bg={activeSessions > 0 ? 'success' : 'secondary'}>
                                            {activeSessions} {t('users:activity.sessions')}
                                        </Badge>
                                    }
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Active Sessions */}
                {sessions.length > 0 && (
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('users:sections.sessions')}</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive className="mb-0">
                                <thead>
                                    <tr>
                                        <th>{t('users:sessions.ipAddress')}</th>
                                        <th>{t('users:sessions.device')}</th>
                                        <th>{t('users:sessions.lastActivity')}</th>
                                        <th>{t('users:sessions.status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map((session) => (
                                        <tr key={session.id}>
                                            <td>
                                                <code>{session.ip_address}</code>
                                            </td>
                                            <td className="text-truncate" style={{ maxWidth: '300px' }}>
                                                <small className="text-muted">{session.user_agent}</small>
                                            </td>
                                            <td>{formatDate(session.last_activity)}</td>
                                            <td>
                                                {session.is_current ? (
                                                    <Badge bg="success">{t('users:sessions.current')}</Badge>
                                                ) : (
                                                    <Badge bg="secondary">{t('users:sessions.active')}</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                )}

                {/* Back Button */}
                <div className="d-flex justify-content-start">
                    <Link href={route('users.index')}>
                        <Button variant="secondary">
                            <IconArrowLeft size={16} className="me-1" />
                            {t('common:actions.back')}
                        </Button>
                    </Link>
                </div>

                {/* Force Logout Confirmation Modal */}
                <ConfirmModal
                    show={logoutModal.show}
                    onClose={() => setLogoutModal({ show: false })}
                    onConfirm={handleForceLogout}
                    title={t('users:messages.forceLogoutTitle')}
                    message={t('users:messages.confirmForceLogout', {
                        name: user.name,
                    })}
                    loading={loggingOut}
                    variant="warning"
                    confirmLabel={t('users:actions.forceLogout')}
                />
            </div>
        </MainLayout>
    );
}
