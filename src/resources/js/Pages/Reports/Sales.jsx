import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Badge, Card, Row, Col } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, DataTable } from '@/components/ui';

const statusColors = { valid: 'success', annulled: 'danger', draft: 'warning' };
const formatCurrency = (val) => parseFloat(val ?? 0).toFixed(2);

export default function ReportsSales({ sales, totals, stores, filters }) {
    const { t } = useTranslation(['reports', 'sales', 'common']);

    const columns = [
        {
            key: 'code',
            label: t('sales:fields.code'),
            sortable: true,
            render: (row) => <code className="text-primary">{row.code}</code>,
        },
        {
            key: 'sale_date',
            label: t('sales:fields.saleDate'),
            sortable: true,
            render: (row) => row.sale_date?.split('T')[0] ?? '-',
        },
        {
            key: 'client',
            label: t('sales:fields.client'),
            sortable: false,
            render: (row) => row.client?.name ?? '-',
        },
        {
            key: 'store',
            label: t('sales:fields.store'),
            sortable: false,
            render: (row) => row.store?.name ?? '-',
        },
        {
            key: 'subtotal',
            label: t('sales:fields.subtotal'),
            sortable: false,
            render: (row) => formatCurrency(row.subtotal),
        },
        {
            key: 'discount',
            label: t('sales:fields.discount'),
            sortable: false,
            render: (row) => <span className="text-danger">{formatCurrency(row.discount)}</span>,
        },
        {
            key: 'total',
            label: t('sales:fields.total'),
            sortable: false,
            render: (row) => (
                <span className="fw-medium">
                    {formatCurrency((row.subtotal ?? 0) - (row.discount ?? 0))}
                </span>
            ),
        },
        {
            key: 'status',
            label: t('sales:fields.status'),
            sortable: false,
            render: (row) => (
                <Badge bg={statusColors[row.status] ?? 'secondary'}>
                    {t(`sales:statuses.${row.status}`)}
                </Badge>
            ),
        },
    ];

    const handleFilter = (key, value) => {
        router.get(route('reports.sales'), { ...filters, [key]: value, page: 1 }, { preserveState: true });
    };

    return (
        <MainLayout>
            <Head title={t('reports:sales.title')} />
            <PageHeader
                title={t('reports:sales.title')}
                subtitle={t('reports:sales.description')}
                breadcrumbs={[
                    { label: t('reports:title'), href: route('reports.index') },
                    { label: t('reports:sales.title') },
                ]}
            />

            <Row className="g-3 mb-4">
                {[
                    { label: t('reports:sales.totalSales'), value: totals.count, color: 'primary' },
                    { label: t('sales:fields.subtotal'), value: formatCurrency(totals.subtotal), color: 'info' },
                    { label: t('sales:fields.total'), value: formatCurrency(totals.total), color: 'success' },
                    { label: t('sales:fields.paid'), value: formatCurrency(totals.paid), color: 'warning' },
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
                data={sales.data}
                pagination={sales}
                filters={filters}
                routeName="reports.sales"
            >
                <Form.Select size="sm" style={{ width: 180 }} value={filters.store_id ?? 'all'}
                    onChange={e => handleFilter('store_id', e.target.value)}>
                    <option value="all">{t('reports:filters.allStores')}</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Form.Select>
                <Form.Select size="sm" style={{ width: 140 }} value={filters.status ?? 'all'}
                    onChange={e => handleFilter('status', e.target.value)}>
                    <option value="all">{t('common:status.all')}</option>
                    {['valid', 'annulled', 'draft'].map(s => (
                        <option key={s} value={s}>{t(`sales:statuses.${s}`)}</option>
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
