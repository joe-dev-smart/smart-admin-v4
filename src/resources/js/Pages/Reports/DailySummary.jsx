import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Card, Row, Col, Table, Badge, ProgressBar } from 'react-bootstrap';
import { IconCalendar, IconTrendingUp } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

const formatCurrency = (val) => parseFloat(val ?? 0).toFixed(2);

export default function ReportsDailySummary({ rows, totals, stores, filters }) {
    const { t } = useTranslation(['reports', 'sales', 'common']);

    const maxTotal = rows.reduce((max, r) => Math.max(max, parseFloat(r.total ?? 0)), 0);

    const handleFilter = (key, value) => {
        router.get(route('reports.daily-summary'), { ...filters, [key]: value }, { preserveState: true });
    };

    const dayLabel = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <MainLayout>
            <Head title={t('reports:dailySummary.title')} />
            <PageHeader
                title={t('reports:dailySummary.title')}
                subtitle={t('reports:dailySummary.description')}
                breadcrumbs={[
                    { label: t('reports:title'), href: route('reports.index') },
                    { label: t('reports:dailySummary.title') },
                ]}
            />

            {/* Filters */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <div className="d-flex gap-3 flex-wrap align-items-center">
                        <Form.Select size="sm" style={{ width: 180 }} value={filters.store_id ?? 'all'}
                            onChange={e => handleFilter('store_id', e.target.value)}>
                            <option value="all">{t('reports:filters.allStores')}</option>
                            {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Form.Select>
                        <div className="d-flex align-items-center gap-2">
                            <IconCalendar size={16} className="text-muted" />
                            <Form.Control size="sm" type="date" style={{ width: 150 }} value={filters.date_from ?? ''}
                                onChange={e => handleFilter('date_from', e.target.value)} />
                            <span className="text-muted">—</span>
                            <Form.Control size="sm" type="date" style={{ width: 150 }} value={filters.date_to ?? ''}
                                onChange={e => handleFilter('date_to', e.target.value)} />
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Summary cards */}
            <Row className="g-3 mb-4">
                {[
                    { label: t('reports:dailySummary.totalSales'), value: totals.sale_count, color: 'primary' },
                    { label: t('reports:dailySummary.totalRevenue'), value: formatCurrency(totals.total), color: 'success' },
                    { label: t('reports:dailySummary.totalCollected'), value: formatCurrency(totals.collected), color: 'info' },
                    { label: t('reports:dailySummary.totalOutstanding'), value: formatCurrency(totals.outstanding), color: 'warning' },
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

            {totals.best_day && (
                <Card className="shadow-sm mb-4 border-success border-2">
                    <Card.Body className="d-flex align-items-center gap-3">
                        <IconTrendingUp size={28} className="text-success flex-shrink-0" />
                        <div>
                            <p className="mb-0 fw-medium">{t('reports:dailySummary.bestDay')}: <span className="text-success">{dayLabel(totals.best_day)}</span></p>
                            <p className="mb-0 text-muted small">{t('reports:dailySummary.revenue')}: <strong>{formatCurrency(totals.best_day_total)}</strong></p>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* Daily table with mini bar chart */}
            <Card className="shadow-sm">
                <Card.Header className="bg-white">
                    <h6 className="mb-0">{t('reports:dailySummary.dailyBreakdown')}</h6>
                </Card.Header>
                {rows.length > 0 ? (
                    <Table size="sm" className="mb-0" responsive>
                        <thead className="table-light">
                            <tr>
                                <th>{t('reports:dailySummary.date')}</th>
                                <th className="text-end">{t('reports:dailySummary.salesCount')}</th>
                                <th className="text-end">{t('reports:dailySummary.revenue')}</th>
                                <th className="text-end">{t('reports:dailySummary.collected')}</th>
                                <th className="text-end">{t('reports:dailySummary.outstanding')}</th>
                                <th style={{ width: 140 }}>{t('reports:dailySummary.chart')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => {
                                const pct = maxTotal > 0 ? (parseFloat(row.total) / maxTotal) * 100 : 0;
                                const outstanding = parseFloat(row.outstanding ?? 0);
                                return (
                                    <tr key={row.day}>
                                        <td className="fw-medium">{dayLabel(row.day)}</td>
                                        <td className="text-end">{row.sale_count}</td>
                                        <td className="text-end fw-medium">{formatCurrency(row.total)}</td>
                                        <td className="text-end text-success">{formatCurrency(row.collected)}</td>
                                        <td className="text-end">
                                            {outstanding > 0
                                                ? <span className="text-danger">{formatCurrency(outstanding)}</span>
                                                : <span className="text-muted">—</span>
                                            }
                                        </td>
                                        <td>
                                            <ProgressBar
                                                now={pct}
                                                variant={pct > 75 ? 'success' : pct > 40 ? 'info' : 'secondary'}
                                                style={{ height: 8 }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                ) : (
                    <Card.Body>
                        <p className="text-muted text-center py-4">{t('common:table.noData')}</p>
                    </Card.Body>
                )}
            </Card>
        </MainLayout>
    );
}
