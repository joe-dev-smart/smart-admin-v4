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

export default function BrandsIndex({ brands, filters }) {
    const { t } = useTranslation(['brands', 'common']);
    const { flash } = usePage().props;
    const [deleteModal, setDeleteModal] = useState({ show: false, brand: null });
    const [deleting, setDeleting] = useState(false);

    // Table columns configuration
    const columns = [
        {
            key: 'name',
            label: t('brands:fields.name'),
            sortable: true,
            render: (row) => <span className="fw-medium">{row.name}</span>,
        },
        {
            key: 'description',
            label: t('brands:fields.description'),
            sortable: false,
            render: (row) => (
                <div className="text-muted small text-truncate" style={{ maxWidth: '400px' }}>
                    {row.description || '-'}
                </div>
            ),
        },
        {
            key: 'status',
            label: t('brands:fields.status'),
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
                    editRoute={route('brands.edit', row.id)}
                    onDelete={() => setDeleteModal({ show: true, brand: row })}
                />
            ),
        },
    ];

    // Handle delete confirmation
    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('brands.destroy', deleteModal.brand.id), {
            onSuccess: () => {
                setDeleteModal({ show: false, brand: null });
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    // Handle status filter change
    const handleStatusFilter = (value) => {
        router.get(
            route('brands.index'),
            { ...filters, status: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <MainLayout>
            <Head title={t('brands:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('brands:title')}
                    subtitle={t('brands:subtitle')}
                    createRoute={route('brands.create')}
                    createLabel={t('brands:index.addNew')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('brands:title') },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={brands.data}
                    pagination={brands}
                    filters={filters}
                    routeName="brands.index"
                >
                    {/* Status Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.status || 'all'}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('brands:filters.all')}</option>
                        <option value="enabled">{t('brands:filters.enabled')}</option>
                        <option value="disabled">{t('brands:filters.disabled')}</option>
                    </Form.Select>
                </DataTable>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, brand: null })}
                    onConfirm={handleDelete}
                    title={t('common:messages.confirmDeleteTitle')}
                    message={t('brands:messages.deleteConfirm')}
                    loading={deleting}
                />
            </div>
        </MainLayout>
    );
}
