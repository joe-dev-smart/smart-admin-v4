import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Badge, Button } from 'react-bootstrap';
import { IconLogout } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import {
    PageHeader,
    DataTable,
    StatusBadge,
    ActionButtons,
    ConfirmModal,
} from '@/components/ui';

export default function UsersIndex({ users, roles, filters }) {
    const { t } = useTranslation(['users', 'common']);
    const { flash, auth } = usePage().props;
    const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
    const [logoutModal, setLogoutModal] = useState({ show: false, user: null });
    const [deleting, setDeleting] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // Table columns configuration
    const columns = [
        {
            key: 'name',
            label: t('users:fields.name'),
            sortable: true,
            render: (row) => (
                <div>
                    <span className="fw-medium">{row.name}</span>
                    <div className="text-muted small">@{row.username}</div>
                </div>
            ),
        },
        {
            key: 'email',
            label: t('users:fields.email'),
            sortable: true,
        },
        {
            key: 'role',
            label: t('users:fields.role'),
            sortable: false,
            width: '150px',
            render: (row) => (
                <Badge bg={row.role?.slug === 'super-admin' ? 'danger' : 'primary'}>
                    {row.role?.name || '-'}
                </Badge>
            ),
        },
        {
            key: 'stores',
            label: t('users:fields.stores'),
            sortable: false,
            render: (row) => (
                <div>
                    {row.stores?.length > 0 ? (
                        row.stores.length <= 2 ? (
                            row.stores.map((store, idx) => (
                                <Badge key={store.id} bg="secondary" className="me-1">
                                    {store.name}
                                </Badge>
                            ))
                        ) : (
                            <Badge bg="secondary">
                                {row.stores.length} {t('users:storesAssigned')}
                            </Badge>
                        )
                    ) : (
                        <span className="text-muted">-</span>
                    )}
                </div>
            ),
        },
        {
            key: 'is_active',
            label: t('users:fields.status'),
            sortable: true,
            width: '120px',
            render: (row) => <StatusBadge status={row.is_active ? 'enabled' : 'disabled'} />,
        },
        {
            key: 'actions',
            label: t('common:table.actions'),
            width: '180px',
            render: (row) => {
                const isCurrentUser = row.id === auth.user.id;
                const isSuperAdmin = row.role?.slug === 'super-admin';

                return (
                    <ActionButtons
                        viewRoute={route('users.show', row.id)}
                        editRoute={route('users.edit', row.id)}
                        onDelete={!isCurrentUser && !isSuperAdmin
                            ? () => setDeleteModal({ show: true, user: row })
                            : null}
                    >
                        {!isCurrentUser && (
                            <Button
                                title={t('users:actions.forceLogout')}
                                variant="outline-warning"
                                size="sm"
                                className="btn-icon"
                                onClick={() => setLogoutModal({ show: true, user: row })}
                            >
                                <IconLogout size={16} />
                            </Button>
                        )}
                    </ActionButtons>
                );
            },
        },
    ];

    // Handle delete confirmation
    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('users.destroy', deleteModal.user.id), {
            onSuccess: () => {
                setDeleteModal({ show: false, user: null });
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    // Handle force logout confirmation
    const handleForceLogout = () => {
        setLoggingOut(true);
        router.post(route('users.force-logout', logoutModal.user.id), {}, {
            onSuccess: () => {
                setLogoutModal({ show: false, user: null });
            },
            onFinish: () => {
                setLoggingOut(false);
            },
        });
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        router.get(
            route('users.index'),
            { ...filters, [key]: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <MainLayout>
            <Head title={t('users:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('users:title')}
                    subtitle={t('users:subtitle')}
                    createRoute={route('users.create')}
                    createLabel={t('users:newUser')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('users:title') },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={users.data}
                    pagination={users}
                    filters={filters}
                    routeName="users.index"
                >
                    {/* Role Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.role_id || 'all'}
                        onChange={(e) => handleFilterChange('role_id', e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('users:filters.allRoles')}</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </Form.Select>

                    {/* Status Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.status || 'all'}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('users:filters.allStatuses')}</option>
                        <option value="active">{t('common:status.enabled')}</option>
                        <option value="inactive">{t('common:status.disabled')}</option>
                    </Form.Select>
                </DataTable>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, user: null })}
                    onConfirm={handleDelete}
                    title={t('common:messages.confirmDeleteTitle')}
                    message={t('users:messages.confirmDelete', {
                        name: deleteModal.user?.name,
                    })}
                    loading={deleting}
                />

                {/* Force Logout Confirmation Modal */}
                <ConfirmModal
                    show={logoutModal.show}
                    onClose={() => setLogoutModal({ show: false, user: null })}
                    onConfirm={handleForceLogout}
                    title={t('users:messages.forceLogoutTitle')}
                    message={t('users:messages.confirmForceLogout', {
                        name: logoutModal.user?.name,
                    })}
                    loading={loggingOut}
                    variant="warning"
                    confirmLabel={t('users:actions.forceLogout')}
                />
            </div>
        </MainLayout>
    );
}
