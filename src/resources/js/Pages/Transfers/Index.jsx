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
    in_transit: 'info',
    completed: 'success',
    cancelled: 'danger',
};

const typeColors = {
    add: 'success',
    transfer: 'primary',
    remove: 'danger',
};

export default function TransfersIndex({ transfers, stores, filters }) {
    const { t } = useTranslation(['transfers', 'common']);
    const { flash } = usePage().props;
    const [deleteModal, setDeleteModal] = useState({ show: false, transfer: null });
    const [deleting, setDeleting] = useState(false);

    // Table columns configuration
    const columns = [
        {
            key: 'code',
            label: t('transfers:fields.code'),
            sortable: true,
            width: '140px',
            render: (row) => <code className="text-primary">{row.code}</code>,
        },
        {
            key: 'type',
            label: t('transfers:fields.type'),
            sortable: true,
            width: '120px',
            render: (row) => (
                <Badge bg={typeColors[row.type] || 'secondary'}>
                    {t(`transfers:types.${row.type}`)}
                </Badge>
            ),
        },
        {
            key: 'transfer_date',
            label: t('transfers:fields.transferDate'),
            sortable: true,
            width: '120px',
            render: (row) => new Date(row.transfer_date).toLocaleDateString(),
        },
        {
            key: 'from_store',
            label: t('transfers:fields.fromStore'),
            sortable: false,
            render: (row) => row.from_store?.name || '-',
        },
        {
            key: 'to_store',
            label: t('transfers:fields.toStore'),
            sortable: false,
            render: (row) => row.to_store?.name || '-',
        },
        {
            key: 'user',
            label: t('transfers:fields.createdBy'),
            sortable: false,
            render: (row) => row.user?.name || '-',
        },
        {
            key: 'status',
            label: t('transfers:fields.status'),
            sortable: true,
            width: '130px',
            render: (row) => (
                <Badge bg={statusColors[row.status] || 'secondary'}>
                    {t(`transfers:statuses.${row.status}`)}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: t('common:table.actions'),
            width: '120px',
            render: (row) => (
                <ActionButtons
                    editRoute={route('transfers.edit', row.id)}
                    onDelete={() => setDeleteModal({ show: true, transfer: row })}
                />
            ),
        },
    ];

    // Handle delete confirmation
    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('transfers.destroy', deleteModal.transfer.id), {
            onSuccess: () => {
                setDeleteModal({ show: false, transfer: null });
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        router.get(
            route('transfers.index'),
            { ...filters, [key]: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <MainLayout>
            <Head title={t('transfers:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('transfers:title')}
                    subtitle={t('transfers:subtitle')}
                    createRoute={route('transfers.create')}
                    createLabel={t('transfers:newTransfer')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('transfers:title') },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={transfers.data}
                    pagination={transfers}
                    filters={filters}
                    routeName="transfers.index"
                >
                    {/* Type Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.type || 'all'}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('transfers:filters.allTypes')}</option>
                        <option value="add">{t('transfers:types.add')}</option>
                        <option value="transfer">{t('transfers:types.transfer')}</option>
                        <option value="remove">{t('transfers:types.remove')}</option>
                    </Form.Select>

                    {/* From Store Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.from_store_id || 'all'}
                        onChange={(e) => handleFilterChange('from_store_id', e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('transfers:filters.fromStore')}</option>
                        {stores.map((store) => (
                            <option key={store.id} value={store.id}>
                                {store.name}
                            </option>
                        ))}
                    </Form.Select>

                    {/* To Store Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.to_store_id || 'all'}
                        onChange={(e) => handleFilterChange('to_store_id', e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('transfers:filters.toStore')}</option>
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
                        <option value="all">{t('transfers:filters.allStatuses')}</option>
                        <option value="pending">{t('transfers:statuses.pending')}</option>
                        <option value="in_transit">{t('transfers:statuses.in_transit')}</option>
                        <option value="completed">{t('transfers:statuses.completed')}</option>
                        <option value="cancelled">{t('transfers:statuses.cancelled')}</option>
                    </Form.Select>
                </DataTable>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, transfer: null })}
                    onConfirm={handleDelete}
                    title={t('common:messages.confirmDeleteTitle')}
                    message={t('transfers:messages.confirmDelete')}
                    loading={deleting}
                />
            </div>
        </MainLayout>
    );
}
