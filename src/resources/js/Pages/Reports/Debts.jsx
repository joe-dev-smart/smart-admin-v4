import { Head, router, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { IconAlertTriangle } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, DataTable } from '@/components/ui';

const formatCurrency = (val) => parseFloat(val ?? 0).toFixed(2);

export default function ReportsDebts({ sales, totals, byClient, clients, stores, filters }) {
    const { t } = useTranslation(['reports', 'sales', 'common']);

    const columns = [
        {
            key: 'code',
            label: t('sales:fields.code'),
            sortable: true,
            render: (row) => (
                <Link href={route('sales.show', row.id)} className="text-primary fw-medium text-decoration-none">
                    {row.code}
                </Link>
            ),
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
            render: (row) => <span className="fw-medium">{row.client?.name ?? '-'}</span>,
        },
        {
            key: 'store',
            label: t('sales:fields.store'),
            sortable: false,
            render: (row) => row.store?.name ?? '-',
        },
        {
            key: 'total',
            label: t('sales:fields.total'),
            sortable: false,
            render: (row) => formatCurrency((row.subtotal ?? 0) - (row.discount ?? 0)),
        },
        {
            key: 'paid',
            label: t('sales:fields.paid'),
            sortable: false,
            render: (row) => <span className="text-success">{formatCurrency(row.paid)}</span>,
        },
        {
            key: 'outstanding',
            label: t('reports:debts.outstanding'),
            sortable: false,
            render: (row) => {
                const debt = (parseFloat(row.subtotal) - parseFloat(row.discount)) - parseFloat(row.paid);
                return <span className="text-danger fw-bold">{formatCurrency(debt)}</span>;
            },
        },
        {
            key: 'payment',
            label: t('sales:fields.payment'),
            sortable: false,
            render: (row) => (
                <Badge bg="secondary">{t(`sales:payments.${row.payment}`)}</Badge>
            ),
        },
    ];

    const handleFilter = (key, value) => {
        router.get(route('reports.debts'), { ...filters, [key]: value, page: 1 }, { preserveState: true });
    };

    return (
        <MainLayout>
            <Head title={t('reports:debts.title')} />
            <PageHeader
                title={t('reports:debts.title')}
                subtitle={t('reports:debts.description')}
                breadcrumbs={[
                    { label: t('reports:title'), href: route('reports.index') },
                    { label: t('reports:debts.title') },
                ]}
            />

            <Row className="g-3 mb-4">
                <Col sm={4}>
                    <Card className="border-warning shadow-sm">
                        <Card.Body className="text-center">
                            <p className="text-muted small mb-1">{t('reports:debts.clientsWithDebt')}</p>
                            <h4 className="text-warning mb-0">{byClient.length}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={4}>
                    <Card className="border-danger shadow-sm">
                        <Card.Body className="text-center">
                            <p className="text-muted small mb-1">{t('reports:debts.totalPending')}</p>
                            <h4 className="text-danger mb-0">{formatCurrency(totals.total_debt)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={4}>
                    <Card className="border-secondary shadow-sm">
                        <Card.Body className="text-center">
                            <p className="text-muted small mb-1">{t('reports:debts.pendingSales')}</p>
                            <h4 className="text-secondary mb-0">{totals.count}</h4>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {byClient.length > 0 && (
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-white">
                        <div className="d-flex align-items-center gap-2">
                            <IconAlertTriangle size={18} className="text-warning" />
                            <h6 className="mb-0">{t('reports:debts.byClientTitle')}</h6>
                        </div>
                    </Card.Header>
                    <Table size="sm" className="mb-0" responsive>
                        <thead className="table-light">
                            <tr>
                                <th>{t('sales:fields.client')}</th>
                                <th className="text-end">{t('reports:debts.pendingSales')}</th>
                                <th className="text-end">{t('reports:debts.outstanding')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {byClient.map(row => (
                                <tr key={row.client_id}>
                                    <td className="fw-medium">{row.client?.name ?? '-'}</td>
                                    <td className="text-end">{row.sale_count}</td>
                                    <td className="text-end text-danger fw-bold">{formatCurrency(row.outstanding)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            )}

            <DataTable
                columns={columns}
                data={sales.data}
                pagination={sales}
                filters={filters}
                routeName="reports.debts"
            >
                <Form.Select size="sm" style={{ width: 200 }} value={filters.client_id ?? 'all'}
                    onChange={e => handleFilter('client_id', e.target.value)}>
                    <option value="all">{t('reports:filters.allClients')}</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Form.Select>
                <Form.Select size="sm" style={{ width: 180 }} value={filters.store_id ?? 'all'}
                    onChange={e => handleFilter('store_id', e.target.value)}>
                    <option value="all">{t('reports:filters.allStores')}</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Form.Select>
                <Form.Control size="sm" type="date" style={{ width: 150 }} value={filters.date_from ?? ''}
                    onChange={e => handleFilter('date_from', e.target.value)} />
                <Form.Control size="sm" type="date" style={{ width: 150 }} value={filters.date_to ?? ''}
                    onChange={e => handleFilter('date_to', e.target.value)} />
            </DataTable>
        </MainLayout>
    );
}
