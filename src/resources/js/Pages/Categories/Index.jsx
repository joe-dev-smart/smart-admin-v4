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

export default function CategoriesIndex({ categories, filters }) {
    const { t } = useTranslation(['categories', 'common']);
    const { flash } = usePage().props;
    const [deleteModal, setDeleteModal] = useState({ show: false, category: null });
    const [deleting, setDeleting] = useState(false);

    // Table columns configuration
    const columns = [
        {
            key: 'name',
            label: t('categories:fields.name'),
            sortable: true,
            render: (row) => (
                <div>
                    <span className="fw-medium">{row.name}</span>
                    {row.parent && (
                        <div className="text-muted small">
                            {t('categories:fields.parent')}: {row.parent.name}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'description',
            label: t('categories:fields.description'),
            sortable: false,
            render: (row) => (
                <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                    {row.description || '-'}
                </div>
            ),
        },
        {
            key: 'status',
            label: t('categories:fields.status'),
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
                    editRoute={route('categories.edit', row.id)}
                    onDelete={() => setDeleteModal({ show: true, category: row })}
                />
            ),
        },
    ];

    // Handle delete confirmation
    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('categories.destroy', deleteModal.category.id), {
            onSuccess: () => {
                setDeleteModal({ show: false, category: null });
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    // Handle status filter change
    const handleStatusFilter = (value) => {
        router.get(
            route('categories.index'),
            { ...filters, status: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <MainLayout>
            <Head title={t('categories:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('categories:title')}
                    subtitle={t('categories:subtitle')}
                    createRoute={route('categories.create')}
                    createLabel={t('categories:index.addNew')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('categories:title') },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={categories.data}
                    pagination={categories}
                    filters={filters}
                    routeName="categories.index"
                >
                    {/* Status Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.status || 'all'}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('categories:filters.all')}</option>
                        <option value="enabled">{t('categories:filters.enabled')}</option>
                        <option value="disabled">{t('categories:filters.disabled')}</option>
                    </Form.Select>
                </DataTable>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, category: null })}
                    onConfirm={handleDelete}
                    title={t('common:messages.confirmDeleteTitle')}
                    message={t('categories:messages.deleteConfirm')}
                    loading={deleting}
                />
            </div>
        </MainLayout>
    );
}
