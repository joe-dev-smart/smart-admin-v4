import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Badge } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import {
    PageHeader,
    DataTable,
    StatusBadge,
    ActionButtons,
    ConfirmModal,
} from '@/components/ui';

export default function ProductsIndex({ products, categories, brands, filters }) {
    const { t } = useTranslation(['products', 'common']);
    const { flash } = usePage().props;
    const [deleteModal, setDeleteModal] = useState({ show: false, product: null });
    const [deleting, setDeleting] = useState(false);

    // Table columns configuration
    const columns = [
        {
            key: 'code',
            label: t('products:fields.code'),
            sortable: true,
            width: '120px',
            render: (row) => <code className="text-primary">{row.code}</code>,
        },
        {
            key: 'name',
            label: t('products:fields.name'),
            sortable: true,
            render: (row) => (
                <div>
                    <span className="fw-medium">{row.name}</span>
                    {row.model && <div className="text-muted small">{row.model}</div>}
                </div>
            ),
        },
        {
            key: 'category',
            label: t('products:fields.category'),
            sortable: false,
            render: (row) => (
                <Badge bg="light" text="dark">
                    {row.category?.name || '-'}
                </Badge>
            ),
        },
        {
            key: 'brand',
            label: t('products:fields.brand'),
            sortable: false,
            render: (row) => row.brand?.name || '-',
        },
        {
            key: 'sale_price_1',
            label: t('products:fields.salePrice1'),
            sortable: true,
            width: '120px',
            render: (row) => (
                <span className="fw-medium text-success">
                    Bs. {parseFloat(row.sale_price_1).toFixed(2)}
                </span>
            ),
        },
        {
            key: 'status',
            label: t('products:fields.status'),
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
                    editRoute={route('products.edit', row.id)}
                    onDelete={() => setDeleteModal({ show: true, product: row })}
                />
            ),
        },
    ];

    // Handle delete confirmation
    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('products.destroy', deleteModal.product.id), {
            onSuccess: () => {
                setDeleteModal({ show: false, product: null });
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        router.get(
            route('products.index'),
            { ...filters, [key]: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <MainLayout>
            <Head title={t('products:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('products:title')}
                    subtitle={t('products:subtitle')}
                    createRoute={route('products.create')}
                    createLabel={t('products:index.addNew')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('products:title') },
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={products.data}
                    pagination={products}
                    filters={filters}
                    routeName="products.index"
                >
                    {/* Category Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.category_id || 'all'}
                        onChange={(e) => handleFilterChange('category_id', e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('products:filters.allCategories')}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Form.Select>

                    {/* Brand Filter */}
                    <Form.Select
                        size="sm"
                        value={filters.brand_id || 'all'}
                        onChange={(e) => handleFilterChange('brand_id', e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{t('products:filters.allBrands')}</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
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
                        <option value="all">{t('products:filters.all')}</option>
                        <option value="enabled">{t('products:filters.enabled')}</option>
                        <option value="disabled">{t('products:filters.disabled')}</option>
                    </Form.Select>
                </DataTable>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, product: null })}
                    onConfirm={handleDelete}
                    title={t('common:messages.confirmDeleteTitle')}
                    message={t('products:messages.deleteConfirm')}
                    loading={deleting}
                />
            </div>
        </MainLayout>
    );
}
