import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Badge, Card, Row, Col } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, DataTable } from '@/components/ui';

const formatCurrency = (val) => parseFloat(val ?? 0).toFixed(2);

export default function ReportsInventoryValue({ stocks, summary, stores, categories, filters }) {
    const { t } = useTranslation(['reports', 'products', 'common']);

    const columns = [
        {
            key: 'product',
            label: t('products:fields.name'),
            sortable: false,
            render: (row) => (
                <div>
                    <div className="fw-medium">{row.product?.name ?? '—'}</div>
                    <div className="text-muted small">{row.product?.code}</div>
                </div>
            ),
        },
        {
            key: 'category',
            label: t('products:fields.category'),
            sortable: false,
            render: (row) => row.product?.category?.name ?? '—',
        },
        {
            key: 'brand',
            label: t('products:fields.brand'),
            sortable: false,
            render: (row) => row.product?.brand?.name ?? '—',
        },
        {
            key: 'store',
            label: t('reports:stock.store'),
            sortable: false,
            render: (row) => row.store?.name ?? '—',
        },
        {
            key: 'quantity',
            label: t('reports:stock.quantity'),
            sortable: false,
            render: (row) => (
                <Badge bg={row.quantity <= 0 ? 'danger' : 'success'}>{row.quantity}</Badge>
            ),
        },
        {
            key: 'sale_price_1',
            label: t('reports:inventoryValue.unitPrice'),
            sortable: false,
            render: (row) => formatCurrency(row.product?.sale_price_1),
        },
        {
            key: 'estimated_value',
            label: t('reports:inventoryValue.estimatedValue'),
            sortable: false,
            render: (row) => (
                <span className="fw-bold text-primary">
                    {formatCurrency(row.quantity * parseFloat(row.product?.sale_price_1 ?? 0))}
                </span>
            ),
        },
    ];

    const handleFilter = (key, value) => {
        router.get(route('reports.inventory-value'), { ...filters, [key]: value, page: 1 }, { preserveState: true });
    };

    return (
        <MainLayout>
            <Head title={t('reports:inventoryValue.title')} />
            <PageHeader
                title={t('reports:inventoryValue.title')}
                subtitle={t('reports:inventoryValue.description')}
                breadcrumbs={[
                    { label: t('reports:title'), href: route('reports.index') },
                    { label: t('reports:inventoryValue.title') },
                ]}
            />

            <Row className="g-3 mb-4">
                <Col sm={6}>
                    <Card className="border-primary shadow-sm">
                        <Card.Body className="text-center">
                            <p className="text-muted small mb-1">{t('reports:inventoryValue.totalUnits')}</p>
                            <h4 className="text-primary mb-0">{Number(summary.total_units).toLocaleString()}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={6}>
                    <Card className="border-success shadow-sm">
                        <Card.Body className="text-center">
                            <p className="text-muted small mb-1">{t('reports:inventoryValue.totalValue')}</p>
                            <h4 className="text-success mb-0">{formatCurrency(summary.total_value)}</h4>
                            <small className="text-muted">{t('reports:inventoryValue.basedOnPrice1')}</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <DataTable
                columns={columns}
                data={stocks.data}
                pagination={stocks}
                filters={filters}
                routeName="reports.inventory-value"
                searchable={false}
            >
                <Form.Select size="sm" style={{ width: 180 }} value={filters.store_id ?? 'all'}
                    onChange={e => handleFilter('store_id', e.target.value)}>
                    <option value="all">{t('reports:filters.allStores')}</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Form.Select>
                <Form.Select size="sm" style={{ width: 200 }} value={filters.category_id ?? 'all'}
                    onChange={e => handleFilter('category_id', e.target.value)}>
                    <option value="all">{t('reports:filters.allCategories')}</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Form.Select>
            </DataTable>
        </MainLayout>
    );
}
