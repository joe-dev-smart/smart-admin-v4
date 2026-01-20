import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Badge } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import {
    PageHeader,
    DataTable,
    ActionButtons,
    ConfirmModal,
} from '@/components/ui';

const statusColors = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'danger',
};

export default function PurchasesIndex({ purchases, providers, stores, filters }) {
    const { t } = useTranslation(['purchases', 'common']);
    const { flash } = usePage().props;
    const [deleteModal, setDeleteModal] = useState({ show: false, purchase: null });
    const [deleting, setDeleting] = useState(false);

    // Table columns configuration
    const columns = [
        {
            key: 'code',
            label: t('purchases:fields.code'),
            sortable: true,
            width: '140px',
            render: (row) => <code className="text-primary">{row.code}</code>,
        },
        {
            key: 'purchase_date',
            label: t('purchases:fields.purchaseDate'),
            sortable: true,
            width: '120px',
            render: (row) => new Date(row.purchase_date).toLocaleDateString(),
        },
        {
            key: 'provider',
            label: t('purchases:fields.provider'),
            sortable: false,
            render: (row) => row.provider?.name || '-',
        },
        {
            key: 'store',
            label: t('purchases:fields.store'),
            sortable: false,
            render: (row) => row.store?.name || '-',
        },
        {
            key: 'total',
            label: t('purchases:fields.total'),
            sortable: true,
            width: '120px',
            render: (row) => (
                <span className="fw-medium text-success">
                    Bs. {parseFloat(row.total).toFixed(2)}
                </span>
            ),
        },
        {
            key: 'status',
            label: t('purchases:fields.status'),
            sortable: true,
            width: '120px',
            render: (row) => (
                <Badge bg={statusColors[row.status] || 'secondary'}>
                    {t(`purchases:statuses.${row.status}`)}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: t('common:table.actions'),
            width: '120px',
            render: (row) => (
                <ActionButtons
                    editRoute={route('purchases.edit', row.id)}
                    onDelete={() => setDeleteModal({ show: true, purchase: row })}
                />
            ),
        },
    ];

    // Handle delete confirmation
    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('purchases.destroy', deleteModal.purchase.id), {
            onSuccess: () => {
                setDeleteModal({ show: false, purchase: null });
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        router.get(
            route('purchases.index'),
            { ...filters, [key]: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <MainLayout>
            <Head title={t('purchases:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('purchases:title')}
                    subtitle={t('purchases:subtitle')}
                    createRoute={route('purchases.create')}
                    createLabel={t('purchases:newPurchase')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('purchases:title') },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={purchases.data}
                    pagination={purchases}
                    filters={filters}
                    routeName="purchases.index"
                >
                    {/* Provider Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.provider_id || 'all'}
                        onChange={(e) => handleFilterChange('provider_id', e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('purchases:filters.allProviders')}</option>
                        {providers.map((provider) => (
                            <option key={provider.id} value={provider.id}>
                                {provider.name}
                            </option>
                        ))}
                    </Form.Select>

                    {/* Store Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.store_id || 'all'}
                        onChange={(e) => handleFilterChange('store_id', e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('purchases:filters.allStores')}</option>
                        {stores.map((store) => (
                            <option key={store.id} value={store.id}>
                                {store.name}
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
                        <option value="all">{t('purchases:filters.allStatuses')}</option>
                        <option value="pending">{t('purchases:statuses.pending')}</option>
                        <option value="completed">{t('purchases:statuses.completed')}</option>
                        <option value="cancelled">{t('purchases:statuses.cancelled')}</option>
                    </Form.Select>
                </DataTable>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, purchase: null })}
                    onConfirm={handleDelete}
                    title={t('common:messages.confirmDeleteTitle')}
                    message={t('purchases:messages.confirmDelete')}
                    loading={deleting}
                />
            </div>
        </MainLayout>
    );
}
