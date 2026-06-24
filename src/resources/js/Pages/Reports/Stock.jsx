import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Badge } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, DataTable } from '@/components/ui';

export default function ReportsStock({ stocks, stores, filters }) {
    const { t } = useTranslation(['reports', 'common']);

    const columns = [
        {
            key: 'product',
            label: t('reports:stock.product'),
            sortable: false,
            render: (row) => (
                <div>
                    <div className="fw-medium">{row.product?.name}</div>
                    <div className="text-muted small">{row.product?.code}</div>
                </div>
            ),
        },
        {
            key: 'category',
            label: t('reports:stock.category'),
            sortable: false,
            render: (row) => row.product?.category?.name ?? '-',
        },
        {
            key: 'store',
            label: t('reports:stock.store'),
            sortable: false,
            render: (row) => row.store?.name ?? '-',
        },
        {
            key: 'quantity',
            label: t('reports:stock.quantity'),
            sortable: false,
            render: (row) => {
                const minStock = row.product?.minimum_stock ?? 0;
                const isLow = minStock > 0 && row.quantity <= minStock;
                return (
                    <Badge bg={row.quantity <= 0 ? 'danger' : isLow ? 'warning' : 'success'}>
                        {row.quantity}
                    </Badge>
                );
            },
        },
        {
            key: 'minimum_stock',
            label: t('reports:stock.minimumStock'),
            sortable: false,
            render: (row) => row.product?.minimum_stock ?? 0,
        },
    ];

    const handleFilter = (key, value) => {
        router.get(route('reports.stock'), { ...filters, [key]: value, page: 1 }, { preserveState: true });
    };

    return (
        <MainLayout>
            <Head title={t('reports:stock.title')} />
            <PageHeader
                title={t('reports:stock.title')}
                subtitle={t('reports:stock.description')}
                breadcrumbs={[
                    { label: t('reports:title'), href: route('reports.index') },
                    { label: t('reports:stock.title') },
                ]}
            />

            <DataTable
                columns={columns}
                data={stocks.data}
                pagination={stocks}
                filters={filters}
                routeName="reports.stock"
            >
                <Form.Select size="sm" style={{ width: 180 }} value={filters.store_id ?? 'all'}
                    onChange={e => handleFilter('store_id', e.target.value)}>
                    <option value="all">{t('reports:filters.allStores')}</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Form.Select>
                <Form.Check
                    type="switch"
                    id="low-stock-switch"
                    label={t('reports:stock.showLowStockOnly')}
                    checked={!!filters.low_stock}
                    onChange={e => handleFilter('low_stock', e.target.checked ? '1' : '')}
                    className="ms-2"
                />
            </DataTable>
        </MainLayout>
    );
}
