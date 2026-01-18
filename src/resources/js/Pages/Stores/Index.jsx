import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import {
    PageHeader,
    DataTable,
    StatusBadge,
    ActionButtons,
    ConfirmModal,
} from '@/components/ui';

export default function StoresIndex({ stores, filters }) {
    const { t } = useTranslation(['stores', 'common']);
    const { flash } = usePage().props;
    const [deleteModal, setDeleteModal] = useState({ show: false, store: null });
    const [deleting, setDeleting] = useState(false);

    // Table columns configuration
    const columns = [
        {
            key: 'name',
            label: t('stores:table.name'),
            sortable: true,
            render: (row) => (
                <div>
                    <span className="fw-medium">{row.name}</span>
                </div>
            ),
        },
        {
            key: 'phone',
            label: t('stores:table.phoneAddress'),
            sortable: false,
            render: (row) => (
                <div>
                    {row.phone && <div className="text-muted small">{row.phone}</div>}
                    {row.address && (
                        <div className="text-muted small text-truncate" style={{ maxWidth: '250px' }}>
                            {row.address}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'allow_sales',
            label: t('stores:table.allowSales'),
            sortable: true,
            width: '150px',
            render: (row) => (
                <StatusBadge
                    status={row.allow_sales}
                    enabledVariant="info"
                    disabledVariant="secondary"
                />
            ),
        },
        {
            key: 'status',
            label: t('stores:table.status'),
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
                    editRoute={route('stores.edit', row.id)}
                    onDelete={() => setDeleteModal({ show: true, store: row })}
                />
            ),
        },
    ];

    // Handle delete confirmation
    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('stores.destroy', deleteModal.store.id), {
            onSuccess: () => {
                setDeleteModal({ show: false, store: null });
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    // Handle status filter change
    const handleStatusFilter = (value) => {
        router.get(
            route('stores.index'),
            { ...filters, status: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <MainLayout>
            <Head title={t('stores:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('stores:title')}
                    subtitle={t('stores:subtitle')}
                    createRoute={route('stores.create')}
                    createLabel={t('stores:create.title')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('stores:title') },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={stores.data}
                    pagination={stores}
                    filters={filters}
                    routeName="stores.index"
                >
                    {/* Status Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.status || 'all'}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('common:status.all')}</option>
                        <option value="enabled">{t('common:status.enabled')}</option>
                        <option value="disabled">{t('common:status.disabled')}</option>
                    </Form.Select>
                </DataTable>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, store: null })}
                    onConfirm={handleDelete}
                    title={t('common:messages.confirmDeleteTitle')}
                    message={t('stores:messages.confirmDelete', {
                        name: deleteModal.store?.name,
                    })}
                    loading={deleting}
                />
            </div>
        </MainLayout>
    );
}
