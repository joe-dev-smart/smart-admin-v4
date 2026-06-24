import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import {
    PageHeader,
    DataTable,
    ActionButtons,
    ConfirmModal,
} from '@/components/ui';

export default function RolesIndex({ roles, filters }) {
    const { t } = useTranslation(['roles', 'common']);
    const { flash } = usePage().props;
    const [deleteModal, setDeleteModal] = useState({ show: false, role: null });
    const [deleting, setDeleting] = useState(false);

    // Table columns configuration
    const columns = [
        {
            key: 'name',
            label: t('roles:fields.name'),
            sortable: true,
            render: (row) => (
                <div>
                    <span className="fw-medium">{row.name}</span>
                    {row.is_system && (
                        <Badge bg="secondary" className="ms-2" size="sm">
                            {t('roles:systemRole')}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            key: 'description',
            label: t('roles:fields.description'),
            sortable: false,
            render: (row) => (
                <span className="text-muted">{row.description || '-'}</span>
            ),
        },
        {
            key: 'users_count',
            label: t('roles:fields.usersCount'),
            sortable: true,
            width: '120px',
            render: (row) => (
                <Badge bg="info">{row.users_count}</Badge>
            ),
        },
        {
            key: 'actions',
            label: t('common:table.actions'),
            width: '120px',
            render: (row) => (
                <ActionButtons
                    editRoute={route('roles.edit', row.id)}
                    onDelete={row.is_system ? null : () => setDeleteModal({ show: true, role: row })}
                />
            ),
        },
    ];

    // Handle delete confirmation
    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('roles.destroy', deleteModal.role.id), {
            onSuccess: () => {
                setDeleteModal({ show: false, role: null });
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    return (
        <MainLayout>
            <Head title={t('roles:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('roles:title')}
                    subtitle={t('roles:subtitle')}
                    createRoute={route('roles.create')}
                    createLabel={t('roles:newRole')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('roles:title') },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={roles.data}
                    pagination={roles}
                    filters={filters}
                    routeName="roles.index"
                />

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, role: null })}
                    onConfirm={handleDelete}
                    title={t('common:messages.confirmDeleteTitle')}
                    message={t('roles:messages.confirmDelete', {
                        name: deleteModal.role?.name,
                    })}
                    loading={deleting}
                />
            </div>
        </MainLayout>
    );
}
