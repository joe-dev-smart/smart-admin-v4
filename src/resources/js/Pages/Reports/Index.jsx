import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import {
    IconPackage,
    IconArrowsExchange,
    IconShoppingCart,
    IconShoppingBag,
    IconTrophy,
    IconAlertCircle,
    IconBuildingWarehouse,
    IconCalendarStats,
} from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

const reports = [
    {
        key: 'stock',
        icon: IconPackage,
        color: 'primary',
        routeName: 'reports.stock',
    },
    {
        key: 'inventoryValue',
        icon: IconBuildingWarehouse,
        color: 'indigo',
        routeName: 'reports.inventory-value',
    },
    {
        key: 'movements',
        icon: IconArrowsExchange,
        color: 'info',
        routeName: 'reports.movements',
    },
    {
        key: 'bestSellers',
        icon: IconTrophy,
        color: 'warning',
        routeName: 'reports.best-sellers',
        badge: 'TOP',
    },
    {
        key: 'sales',
        icon: IconShoppingCart,
        color: 'success',
        routeName: 'reports.sales',
    },
    {
        key: 'dailySummary',
        icon: IconCalendarStats,
        color: 'teal',
        routeName: 'reports.daily-summary',
    },
    {
        key: 'purchases',
        icon: IconShoppingBag,
        color: 'secondary',
        routeName: 'reports.purchases',
    },
    {
        key: 'debts',
        icon: IconAlertCircle,
        color: 'danger',
        routeName: 'reports.debts',
        badge: '!',
    },
];

const colorMap = {
    primary: '#0d6efd',
    info: '#0dcaf0',
    success: '#198754',
    warning: '#ffc107',
    danger: '#dc3545',
    secondary: '#6c757d',
    indigo: '#6610f2',
    teal: '#20c997',
};

const ReportCard = ({ icon: Icon, title, description, href, color, badge }) => (
    <Card className="shadow-sm h-100 border-0" style={{ borderTop: `4px solid ${colorMap[color] ?? colorMap.primary}` }}>
        <Card.Body className="d-flex flex-column p-4">
            <div className="d-flex align-items-start justify-content-between mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 52, height: 52, backgroundColor: `${colorMap[color] ?? colorMap.primary}18` }}>
                    <Icon size={28} style={{ color: colorMap[color] ?? colorMap.primary }} />
                </div>
                {badge && (
                    <Badge bg={color === 'warning' ? 'warning' : color} className="text-white">
                        {badge}
                    </Badge>
                )}
            </div>
            <h6 className="fw-bold mb-1">{title}</h6>
            <p className="text-muted small mb-4 flex-grow-1">{description}</p>
            <Link href={href} className="mt-auto">
                <Button variant="outline-secondary" size="sm" className="w-100">
                    Ver reporte →
                </Button>
            </Link>
        </Card.Body>
    </Card>
);

export default function ReportsIndex() {
    const { t } = useTranslation(['reports']);

    return (
        <MainLayout>
            <Head title={t('reports:title')} />
            <PageHeader
                title={t('reports:title')}
                subtitle={t('reports:subtitle')}
                breadcrumbs={[{ label: t('reports:title') }]}
            />

            <Row className="g-3">
                {reports.map(({ key, icon, color, routeName, badge }) => (
                    <Col key={key} sm={6} lg={4} xl={3}>
                        <ReportCard
                            icon={icon}
                            title={t(`reports:${key}.title`)}
                            description={t(`reports:${key}.description`)}
                            href={route(routeName)}
                            color={color}
                            badge={badge}
                        />
                    </Col>
                ))}
            </Row>
        </MainLayout>
    );
}
