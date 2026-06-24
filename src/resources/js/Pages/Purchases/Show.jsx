import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { IconShoppingBag, IconEdit, IconArrowLeft, IconCalendar } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

const formatCurrency = (val) => parseFloat(val ?? 0).toFixed(2);

const statusColors = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'danger',
};

export default function PurchasesShow({ purchase }) {
    const { t } = useTranslation(['purchases', 'common']);

    return (
        <MainLayout>
            <Head title={`${t('purchases:single')} ${purchase.code}`} />

            <PageHeader
                title={`${t('purchases:single')}: ${purchase.code}`}
                subtitle={purchase.provider?.name}
                breadcrumbs={[
                    { label: t('purchases:title'), href: route('purchases.index') },
                    { label: purchase.code },
                ]}
                actions={
                    <div className="d-flex gap-2">
                        <Link href={route('purchases.index')}>
                            <Button variant="outline-secondary" size="sm">
                                <IconArrowLeft size={16} className="me-1" />
                                {t('common:actions.back')}
                            </Button>
                        </Link>
                        {purchase.status !== 'cancelled' && (
                            <Link href={route('purchases.edit', purchase.id)}>
                                <Button variant="primary" size="sm">
                                    <IconEdit size={16} className="me-1" />
                                    {t('common:actions.edit')}
                                </Button>
                            </Link>
                        )}
                    </div>
                }
            />

            <Row className="g-3">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <IconShoppingBag size={20} className="text-primary" />
                                <h6 className="mb-0">{t('purchases:sections.generalInfo')}</h6>
                            </div>
                            <Badge bg={statusColors[purchase.status] ?? 'secondary'}>
                                {t(`purchases:statuses.${purchase.status}`)}
                            </Badge>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('purchases:fields.code')}</p>
                                    <code className="text-primary">{purchase.code}</code>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('purchases:fields.invoiceNumber')}</p>
                                    <p className="mb-0">{purchase.invoice_number || '-'}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('purchases:fields.provider')}</p>
                                    <p className="mb-0 fw-medium">{purchase.provider?.name ?? '-'}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('purchases:fields.store')}</p>
                                    <p className="mb-0">{purchase.store?.name ?? '-'}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('purchases:fields.purchaseDate')}</p>
                                    <span className="d-flex align-items-center gap-1">
                                        <IconCalendar size={14} className="text-muted" />
                                        {purchase.purchase_date}
                                    </span>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('purchases:fields.createdBy')}</p>
                                    <p className="mb-0">{purchase.user?.name ?? '-'}</p>
                                </Col>
                                {purchase.observation && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('purchases:fields.observation')}</p>
                                        <p className="mb-0">{purchase.observation}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mt-3">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">{t('purchases:sections.items')}</h6>
                        </Card.Header>
                        <Table size="sm" className="mb-0" responsive>
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>{t('purchases:items.product')}</th>
                                    <th className="text-end">{t('purchases:items.quantity')}</th>
                                    <th className="text-end">{t('purchases:items.unitCost')}</th>
                                    <th className="text-end">{t('purchases:items.subtotal')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchase.items?.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <div className="fw-medium">{item.product?.name ?? '-'}</div>
                                            <div className="text-muted small">{item.product?.code}</div>
                                        </td>
                                        <td className="text-end">{item.quantity}</td>
                                        <td className="text-end">{formatCurrency(item.unit_cost)}</td>
                                        <td className="text-end">{formatCurrency(item.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">{t('purchases:sections.summary')}</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">{t('purchases:fields.subtotal')}</span>
                                <span>{formatCurrency(purchase.subtotal)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">{t('purchases:fields.tax')}</span>
                                <span>{formatCurrency(purchase.tax)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">{t('purchases:fields.discount')}</span>
                                <span className="text-danger">-{formatCurrency(purchase.discount)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <span>{t('purchases:fields.total')}</span>
                                <span className="text-primary fs-5">{formatCurrency(purchase.total)}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
}
