import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Badge, Card, Row, Col } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, DataTable } from '@/components/ui';

const formatCurrency = (val) => parseFloat(val ?? 0).toFixed(2);
const statusColors = { pending: 'warning', completed: 'success', cancelled: 'danger' };

export default function ReportsPurchases({ purchases, totals, providers, stores, filters }) {
    const { t } = useTranslation(['reports', 'purchases', 'common']);

    const columns = [
        {
            key: 'code',
            label: t('purchases:fields.code'),
            sortable: true,
            render: (row) => <code className="text-primary">{row.code}</code>,
        },
        {
            key: 'purchase_date',
            label: t('purchases:fields.purchaseDate'),
            sortable: true,
            render: (row) => row.purchase_date,
        },
        {
            key: 'provider',
            label: t('purchases:fields.provider'),
            sortable: false,
            render: (row) => row.provider?.name ?? '-',
        },
        {
            key: 'store',
            label: t('purchases:fields.store'),
            sortable: false,
            render: (row) => row.store?.name ?? '-',
        },
        {
            key: 'items_count',
            label: t('reports:purchases.itemsCount'),
            sortable: false,
            render: (row) => row.items_count ?? 0,
        },
        {
            key: 'total',
            label: t('purchases:fields.total'),
            sortable: true,
            render: (row) => <span className="fw-medium">{formatCurrency(row.total)}</span>,
        },
        {
            key: 'status',
            label: t('purchases:fields.status'),
            sortable: true,
            render: (row) => (
                <Badge bg={statusColors[row.status] ?? 'secondary'}>
                    {t(`purchases:statuses.${row.status}`)}
                </Badge>
            ),
        },
    ];

    const handleFilter = (key, value) => {
        router.get(route('reports.purchases'), { ...filters, [key]: value, page: 1 }, { preserveState: true });
    };

    return (
        <MainLayout>
            <Head title={t('reports:purchases.title')} />
            <PageHeader
                title={t('reports:purchases.title')}
                subtitle={t('reports:purchases.description')}
                breadcrumbs={[
                    { label: t('reports:title'), href: route('reports.index') },
                    { label: t('reports:purchases.title') },
                ]}
            />

            <Row className="g-3 mb-4">
                {[
                    { label: t('reports:purchases.totalOrders'), value: totals.count, color: 'primary' },
                    { label: t('purchases:fields.subtotal'), value: formatCurrency(totals.subtotal), color: 'info' },
                    { label: t('purchases:fields.tax'), value: formatCurrency(totals.tax), color: 'secondary' },
                    { label: t('purchases:fields.total'), value: formatCurrency(totals.total), color: 'success' },
                ].map(({ label, value, color }) => (
                    <Col sm={6} md={3} key={label}>
                        <Card className={`border-${color} shadow-sm`}>
                            <Card.Body className="text-center">
                                <p className="text-muted small mb-1">{label}</p>
                                <h4 className={`text-${color} mb-0`}>{value}</h4>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <DataTable
                columns={columns}
                data={purchases.data}
                pagination={purchases}
                filters={filters}
                routeName="reports.purchases"
            >
                <Form.Select size="sm" style={{ width: 200 }} value={filters.provider_id ?? 'all'}
                    onChange={e => handleFilter('provider_id', e.target.value)}>
                    <option value="all">{t('reports:filters.allProviders')}</option>
                    {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </Form.Select>
                <Form.Select size="sm" style={{ width: 180 }} value={filters.store_id ?? 'all'}
                    onChange={e => handleFilter('store_id', e.target.value)}>
                    <option value="all">{t('reports:filters.allStores')}</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Form.Select>
                <Form.Select size="sm" style={{ width: 140 }} value={filters.status ?? 'all'}
                    onChange={e => handleFilter('status', e.target.value)}>
                    <option value="all">{t('common:status.all')}</option>
                    {['pending', 'completed', 'cancelled'].map(s => (
                        <option key={s} value={s}>{t(`purchases:statuses.${s}`)}</option>
                    ))}
                </Form.Select>
                <Form.Control size="sm" type="date" style={{ width: 150 }} value={filters.date_from ?? ''}
                    onChange={e => handleFilter('date_from', e.target.value)} />
                <Form.Control size="sm" type="date" style={{ width: 150 }} value={filters.date_to ?? ''}
                    onChange={e => handleFilter('date_to', e.target.value)} />
            </DataTable>
        </MainLayout>
    );
}
