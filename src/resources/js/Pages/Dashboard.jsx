import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Card, Badge, Table, Button } from 'react-bootstrap';
import {
    IconPackage, IconAlertTriangle, IconShoppingCart,
    IconCurrencyDollar, IconArrowRight, IconTruck, IconReceipt,
    IconTrendingUp, IconTrophy,
} from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import CustomApexChart from '@/components/CustomApexChart';

const StatCard = ({ icon: Icon, label, value, color, href, viewMore }) => (
    <Card className={`shadow-sm border-start border-${color} border-3 h-100`}>
        <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
                <p className="text-muted small mb-1">{label}</p>
                <h4 className={`text-${color} mb-0 fw-bold`}>{value}</h4>
            </div>
            <div className={`rounded-circle bg-${color} bg-opacity-10 d-flex align-items-center justify-content-center`} style={{ width: 52, height: 52 }}>
                <Icon size={26} className={`text-${color}`} />
            </div>
        </Card.Body>
        {href && (
            <Card.Footer className="bg-transparent py-1 border-top-0">
                <Link href={href} className={`text-${color} small text-decoration-none`}>
                    <IconArrowRight size={12} className="me-1" />{viewMore}
                </Link>
            </Card.Footer>
        )}
    </Card>
);

export default function Dashboard({ stats = {}, recentSales = [], lowStockAlerts = [], dailySummary = [], topSellers = [] }) {
    const { t } = useTranslation('common');
    const { auth } = usePage().props;

    const chartDates = dailySummary.map(d => d.day);
    const chartTotals = dailySummary.map(d => d.total);

    const getChartOptions = () => ({
        chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false }, sparkline: { enabled: false } },
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
        xaxis: {
            categories: chartDates,
            labels: { rotate: -45, style: { fontSize: '10px' }, formatter: v => v?.slice(5) },
            tickAmount: 8,
        },
        yaxis: { labels: { formatter: v => `$${v.toLocaleString()}` } },
        tooltip: { y: { formatter: v => `$${Number(v).toFixed(2)}` } },
        colors: ['#0d6efd'],
        grid: { borderColor: '#f1f1f1', strokeDashArray: 4 },
        dataLabels: { enabled: false },
        markers: { size: 0 },
    });

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <div className="mb-4">
                <h4 className="mb-1">Dashboard</h4>
                <p className="text-muted mb-0">
                    {t('dashboard.welcome', { name: auth?.user?.name })}
                </p>
            </div>

            {/* Stats row — 6 cards */}
            <Row className="g-3 mb-4">
                <Col sm={6} xl={2}>
                    <StatCard
                        icon={IconPackage}
                        label={t('dashboard.activeProducts')}
                        value={stats.totalProducts ?? 0}
                        color="primary"
                        href={route('products.index')}
                        viewMore={t('dashboard.viewMore')}
                    />
                </Col>
                <Col sm={6} xl={2}>
                    <StatCard
                        icon={IconAlertTriangle}
                        label={t('dashboard.lowStock')}
                        value={stats.lowStockCount ?? 0}
                        color={stats.lowStockCount > 0 ? 'danger' : 'success'}
                        href={`${route('reports.stock')}?low_stock=1`}
                        viewMore={t('dashboard.viewMore')}
                    />
                </Col>
                <Col sm={6} xl={2}>
                    <StatCard
                        icon={IconShoppingCart}
                        label={t('dashboard.todaySales')}
                        value={stats.todaySales ?? 0}
                        color="info"
                        href={route('sales.index')}
                        viewMore={t('dashboard.viewMore')}
                    />
                </Col>
                <Col sm={6} xl={2}>
                    <StatCard
                        icon={IconCurrencyDollar}
                        label={t('dashboard.todayRevenue')}
                        value={stats.todaySalesTotal ?? '0.00'}
                        color="success"
                        href={route('reports.sales')}
                        viewMore={t('dashboard.viewMore')}
                    />
                </Col>
                <Col sm={6} xl={2}>
                    <StatCard
                        icon={IconTruck}
                        label={t('dashboard.todayPurchases')}
                        value={stats.todayPurchases ?? 0}
                        color="secondary"
                        href={route('purchases.index')}
                        viewMore={t('dashboard.viewMore')}
                    />
                </Col>
                <Col sm={6} xl={2}>
                    <StatCard
                        icon={IconReceipt}
                        label={t('dashboard.todayPurchasesCost')}
                        value={stats.todayPurchasesTotal ?? '0.00'}
                        color="warning"
                        href={route('reports.purchases')}
                        viewMore={t('dashboard.viewMore')}
                    />
                </Col>
            </Row>

            {/* Revenue chart */}
            <Row className="g-3 mb-4">
                <Col xs={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white d-flex align-items-center gap-2">
                            <IconTrendingUp size={18} className="text-primary" />
                            <h6 className="mb-0">{t('dashboard.revenueChart')}</h6>
                        </Card.Header>
                        <Card.Body className="pb-0">
                            <CustomApexChart
                                type="area"
                                height={200}
                                getOptions={getChartOptions}
                                series={[{ name: t('dashboard.todayRevenue'), data: chartTotals }]}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-3">
                {/* Recent sales */}
                <Col lg={5}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">{t('dashboard.recentSales')}</h6>
                            <Link href={route('sales.index')}>
                                <Button variant="outline-primary" size="sm">{t('dashboard.viewAll')}</Button>
                            </Link>
                        </Card.Header>
                        {recentSales.length > 0 ? (
                            <Table size="sm" className="mb-0" responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th>{t('dashboard.code')}</th>
                                        <th>{t('dashboard.client')}</th>
                                        <th>{t('dashboard.store')}</th>
                                        <th className="text-end">{t('dashboard.total')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSales.map(sale => (
                                        <tr key={sale.id}>
                                            <td>
                                                <Link href={route('sales.show', sale.id)} className="text-primary fw-medium text-decoration-none">
                                                    {sale.code}
                                                </Link>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{sale.sale_date}</div>
                                            </td>
                                            <td className="text-muted small">{sale.client ?? '-'}</td>
                                            <td className="text-muted small">{sale.store ?? '-'}</td>
                                            <td className="text-end fw-medium">{sale.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <Card.Body>
                                <p className="text-muted text-center py-4 small">{t('dashboard.noRecentSales')}</p>
                            </Card.Body>
                        )}
                    </Card>
                </Col>

                {/* Low stock alerts */}
                <Col lg={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">
                                {t('dashboard.lowStockAlerts')}
                                {lowStockAlerts.length > 0 && (
                                    <Badge bg="danger" className="ms-2">{lowStockAlerts.length}</Badge>
                                )}
                            </h6>
                            <Link href={`${route('reports.stock')}?low_stock=1`}>
                                <Button variant="outline-danger" size="sm">{t('dashboard.viewReport')}</Button>
                            </Link>
                        </Card.Header>
                        {lowStockAlerts.length > 0 ? (
                            <Table size="sm" className="mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>{t('dashboard.product')}</th>
                                        <th className="text-end">{t('dashboard.qty')}</th>
                                        <th className="text-end">{t('dashboard.min')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockAlerts.map((alert, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div className="fw-medium small">{alert.product_name}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{alert.store_name}</div>
                                            </td>
                                            <td className="text-end">
                                                <Badge bg={alert.quantity <= 0 ? 'danger' : 'warning'}>
                                                    {alert.quantity}
                                                </Badge>
                                            </td>
                                            <td className="text-end text-muted small">{alert.minimum_stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <Card.Body>
                                <p className="text-success text-center py-4 small">
                                    {t('dashboard.stockOk')}
                                </p>
                            </Card.Body>
                        )}
                    </Card>
                </Col>

                {/* Top 5 best sellers */}
                <Col lg={3}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-white d-flex align-items-center gap-2">
                            <IconTrophy size={16} className="text-warning" />
                            <h6 className="mb-0">{t('dashboard.topSellers')}</h6>
                        </Card.Header>
                        {topSellers.length > 0 ? (
                            <Table size="sm" className="mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>{t('dashboard.product')}</th>
                                        <th className="text-end">{t('dashboard.revenue')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topSellers.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <Badge bg={idx === 0 ? 'warning' : idx === 1 ? 'secondary' : 'light'} text={idx >= 2 ? 'dark' : undefined}>
                                                    {idx + 1}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="fw-medium small">{item.product_name}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{item.total_units} {t('dashboard.units')}</div>
                                            </td>
                                            <td className="text-end fw-medium small">{item.total_revenue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <Card.Body>
                                <p className="text-muted text-center py-4 small">{t('dashboard.noRecentSales')}</p>
                            </Card.Body>
                        )}
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
}
