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

export default function ProvidersIndex({ providers, filters }) {
    const { t } = useTranslation(['providers', 'common']);
    const { flash } = usePage().props;
    const [deleteModal, setDeleteModal] = useState({ show: false, provider: null });
    const [deleting, setDeleting] = useState(false);

    // Table columns configuration
    const columns = [
        {
            key: 'name',
            label: t('providers:fields.name'),
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
            label: t('providers:fields.nit'),
            sortable: true,
            width: '150px',
        },
        {
            key: 'cellphone',
            label: t('providers:fields.cellphone'),
            sortable: false,
            width: '150px',
            render: (row) => (
                <div>
                    {row.cellphone && <div>{row.cellphone}</div>}
                    {row.phone && <div className="text-muted small">{row.phone}</div>}
                </div>
            ),
        },
        {
            key: 'address',
            label: t('providers:fields.address'),
            sortable: false,
            render: (row) => (
                <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>
                    {row.address || '-'}
                </div>
            ),
        },
        {
            key: 'status',
            label: t('providers:fields.status'),
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
                    editRoute={route('providers.edit', row.id)}
                    onDelete={() => setDeleteModal({ show: true, provider: row })}
                />
            ),
        },
    ];

    // Handle delete confirmation
    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('providers.destroy', deleteModal.provider.id), {
            onSuccess: () => {
                setDeleteModal({ show: false, provider: null });
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    // Handle status filter change
    const handleStatusFilter = (value) => {
        router.get(
            route('providers.index'),
            { ...filters, status: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <MainLayout>
            <Head title={t('providers:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('providers:title')}
                    subtitle={t('providers:subtitle')}
                    createRoute={route('providers.create')}
                    createLabel={t('providers:index.addNew')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('providers:title') },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={providers.data}
                    pagination={providers}
                    filters={filters}
                    routeName="providers.index"
                >
                    {/* Status Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.status || 'all'}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('providers:filters.all')}</option>
                        <option value="enabled">{t('providers:filters.enabled')}</option>
                        <option value="disabled">{t('providers:filters.disabled')}</option>
                    </Form.Select>
                </DataTable>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, provider: null })}
                    onConfirm={handleDelete}
                    title={t('common:messages.confirmDeleteTitle')}
                    message={t('providers:messages.deleteConfirm')}
                    loading={deleting}
                />
            </div>
        </MainLayout>
    );
}
