import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import {
    PageHeader,
    DataTable,
    StatusBadge,
    ActionButtons,
    ConfirmModal,
} from '@/components/ui';

export default function ClientsIndex({ clients, filters }) {
    const { t } = useTranslation(['clients', 'common']);
    const { flash } = usePage().props;
    const [deleteModal, setDeleteModal] = useState({ show: false, client: null });
    const [deleting, setDeleting] = useState(false);

    // Table columns configuration
    const columns = [
        {
            key: 'name',
            label: t('clients:fields.name'),
            sortable: true,
            render: (row) => (
                <div>
                    <span className="fw-medium">{row.name}</span>
                    {row.email && <div className="text-muted small">{row.email}</div>}
                </div>
            ),
        },
        {
            key: 'nit',
            label: t('clients:fields.nit'),
            sortable: true,
            width: '150px',
        },
        {
            key: 'phone',
            label: t('clients:fields.phone'),
            sortable: false,
            width: '150px',
            render: (row) => row.phone || '-',
        },
        {
            key: 'address',
            label: t('clients:fields.address'),
            sortable: false,
            render: (row) => (
                <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>
                    {row.address || '-'}
                </div>
            ),
        },
        {
            key: 'status',
            label: t('clients:fields.status'),
            sortable: true,
            width: '120px',
            render: (row) => <StatusBadge status={row.status} />,
        },
        {
            key: 'actions',
            label: t('common:table.actions'),
            width: '120px',
            render: (row) => (
                <ActionButtons
                    editRoute={route('clients.edit', row.id)}
                    onDelete={() => setDeleteModal({ show: true, client: row })}
                />
            ),
        },
    ];

    // Handle delete confirmation
    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('clients.destroy', deleteModal.client.id), {
            onSuccess: () => {
                setDeleteModal({ show: false, client: null });
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    // Handle status filter change
    const handleStatusFilter = (value) => {
        router.get(
            route('clients.index'),
            { ...filters, status: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <MainLayout>
            <Head title={t('clients:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('clients:title')}
                    subtitle={t('clients:subtitle')}
                    createRoute={route('clients.create')}
                    createLabel={t('clients:index.addNew')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('clients:title') },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={clients.data}
                    pagination={clients}
                    filters={filters}
                    routeName="clients.index"
                >
                    {/* Status Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.status || 'all'}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('clients:filters.all')}</option>
                        <option value="enabled">{t('clients:filters.enabled')}</option>
                        <option value="disabled">{t('clients:filters.disabled')}</option>
                    </Form.Select>
                </DataTable>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, client: null })}
                    onConfirm={handleDelete}
                    title={t('common:messages.confirmDeleteTitle')}
                    message={t('clients:messages.deleteConfirm')}
                    loading={deleting}
                />
            </div>
        </MainLayout>
    );
}
