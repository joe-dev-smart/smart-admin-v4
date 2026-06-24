import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Badge, Card, Row, Col } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, DataTable } from '@/components/ui';

const formatCurrency = (val) => parseFloat(val ?? 0).toFixed(2);

export default function ReportsBestSellers({ products, summary, stores, categories, filters }) {
    const { t } = useTranslation(['reports', 'products', 'common']);

    const columns = [
        {
            key: 'rank',
            label: '#',
            sortable: false,
            render: (row, idx) => {
                const page = products.current_page ?? 1;
                const perPage = products.per_page ?? 50;
                const rank = (page - 1) * perPage + idx + 1;
                const colors = ['warning', 'secondary', 'danger'];
                return (
                    <Badge bg={rank <= 3 ? colors[rank - 1] : 'light'}
                        className={rank <= 3 ? 'text-dark fw-bold' : 'text-muted'}>
                        {rank}
                    </Badge>
                );
            },
        },
        {
            key: 'product',
            label: t('products:fields.name'),
            sortable: false,
            render: (row) => (
                <div>
                    <div className="fw-medium">{row.product?.name ?? '—'}</div>
                    <div className="text-muted small">{row.product?.code} · {row.product?.category?.name ?? '—'}</div>
                </div>
            ),
        },
        {
            key: 'total_units',
            label: t('reports:bestSellers.unitsSold'),
            sortable: false,
            render: (row) => <span className="fw-medium">{Number(row.total_units).toLocaleString()}</span>,
        },
        {
            key: 'sale_count',
            label: t('reports:bestSellers.salesCount'),
            sortable: false,
            render: (row) => row.sale_count,
        },
        {
            key: 'total_revenue',
            label: t('reports:bestSellers.revenue'),
            sortable: false,
            render: (row) => <span className="fw-bold text-success">{formatCurrency(row.total_revenue)}</span>,
        },
        {
            key: 'avg_price',
            label: t('reports:bestSellers.avgPrice'),
            sortable: false,
            render: (row) => formatCurrency(row.total_units > 0 ? row.total_revenue / row.total_units : 0),
        },
    ];

    const handleFilter = (key, value) => {
        router.get(route('reports.best-sellers'), { ...filters, [key]: value, page: 1 }, { preserveState: true });
    };

    return (
        <MainLayout>
            <Head title={t('reports:bestSellers.title')} />
            <PageHeader
                title={t('reports:bestSellers.title')}
                subtitle={t('reports:bestSellers.description')}
                breadcrumbs={[
                    { label: t('reports:title'), href: route('reports.index') },
                    { label: t('reports:bestSellers.title') },
                ]}
            />

            <Row className="g-3 mb-4">
                <Col sm={6}>
                    <Card className="border-primary shadow-sm">
                        <Card.Body className="text-center">
                            <p className="text-muted small mb-1">{t('reports:bestSellers.totalUnitsSold')}</p>
                            <h4 className="text-primary mb-0">{Number(summary.total_units).toLocaleString()}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={6}>
                    <Card className="border-success shadow-sm">
                        <Card.Body className="text-center">
                            <p className="text-muted small mb-1">{t('reports:bestSellers.totalRevenue')}</p>
                            <h4 className="text-success mb-0">{formatCurrency(summary.total_revenue)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <DataTable
                columns={columns}
                data={products.data}
                pagination={products}
                filters={filters}
                routeName="reports.best-sellers"
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
                <Form.Select size="sm" style={{ width: 180 }} value={filters.sort_by ?? 'total_revenue'}
                    onChange={e => handleFilter('sort_by', e.target.value)}>
                    <option value="total_revenue">{t('reports:bestSellers.sortByRevenue')}</option>
                    <option value="total_units">{t('reports:bestSellers.sortByUnits')}</option>
                    <option value="sale_count">{t('reports:bestSellers.sortBySales')}</option>
                </Form.Select>
                <Form.Control size="sm" type="date" style={{ width: 150 }} value={filters.date_from ?? ''}
                    onChange={e => handleFilter('date_from', e.target.value)} />
                <Form.Control size="sm" type="date" style={{ width: 150 }} value={filters.date_to ?? ''}
                    onChange={e => handleFilter('date_to', e.target.value)} />
            </DataTable>
        </MainLayout>
    );
}
