import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { IconShoppingCart, IconEdit, IconArrowLeft, IconCalendar, IconBan } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, ConfirmModal } from '@/components/ui';

const statusColors = { valid: 'success', annulled: 'danger', draft: 'warning' };
const formatCurrency = (val) => parseFloat(val ?? 0).toFixed(2);

export default function SalesShow({ sale }) {
    const { t } = useTranslation(['sales', 'common']);
    const [annulModal, setAnnulModal] = useState(false);
    const [annulling, setAnnulling] = useState(false);

    const total = (parseFloat(sale.subtotal) - parseFloat(sale.discount)).toFixed(2);
    const remaining = (parseFloat(total) - parseFloat(sale.paid)).toFixed(2);

    const handleAnnul = () => {
        setAnnulling(true);
        router.patch(route('sales.annul', sale.id), {}, {
            onSuccess: () => setAnnulModal(false),
            onFinish: () => setAnnulling(false),
        });
    };

    return (
        <MainLayout>
            <Head title={`${t('sales:single')} ${sale.code}`} />

            <PageHeader
                title={`${t('sales:single')}: ${sale.code}`}
                subtitle={sale.client?.name}
                breadcrumbs={[
                    { label: t('sales:title'), href: route('sales.index') },
                    { label: sale.code },
                ]}
                actions={
                    <div className="d-flex gap-2">
                        <Link href={route('sales.index')}>
                            <Button variant="outline-secondary" size="sm">
                                <IconArrowLeft size={16} className="me-1" />{t('common:actions.back')}
                            </Button>
                        </Link>
                        {sale.status === 'draft' && (
                            <Link href={route('sales.edit', sale.id)}>
                                <Button variant="primary" size="sm">
                                    <IconEdit size={16} className="me-1" />{t('common:actions.edit')}
                                </Button>
                            </Link>
                        )}
                        {sale.status === 'valid' && (
                            <Button variant="warning" size="sm" onClick={() => setAnnulModal(true)}>
                                <IconBan size={16} className="me-1" />{t('sales:actions.annul')}
                            </Button>
                        )}
                    </div>
                }
            />

            <Row className="g-3">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <IconShoppingCart size={20} className="text-primary" />
                                <h6 className="mb-0">{t('sales:sections.generalInfo')}</h6>
                            </div>
                            <Badge bg={statusColors[sale.status] ?? 'secondary'}>
                                {t(`sales:statuses.${sale.status}`)}
                            </Badge>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('sales:fields.code')}</p>
                                    <code className="text-primary">{sale.code}</code>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('sales:fields.saleDate')}</p>
                                    <span className="d-flex align-items-center gap-1">
                                        <IconCalendar size={14} className="text-muted" />
                                        {sale.sale_date?.split('T')[0]}
                                    </span>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('sales:fields.client')}</p>
                                    <p className="mb-0 fw-medium">{sale.client?.name ?? '-'}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('sales:fields.store')}</p>
                                    <p className="mb-0">{sale.store?.name ?? '-'}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('sales:fields.payment')}</p>
                                    <Badge bg="info" className="text-white">{t(`sales:payments.${sale.payment}`)}</Badge>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('sales:fields.createdBy')}</p>
                                    <p className="mb-0">{sale.user?.name ?? '-'}</p>
                                </Col>
                                {sale.observation && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('sales:fields.observation')}</p>
                                        <p className="mb-0">{sale.observation}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mt-3">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">{t('sales:sections.items')}</h6>
                        </Card.Header>
                        <Table size="sm" className="mb-0" responsive>
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>{t('sales:items.product')}</th>
                                    <th className="text-end">{t('sales:items.quantity')}</th>
                                    <th className="text-end">{t('sales:items.price')}</th>
                                    <th className="text-end">{t('sales:items.subtotal')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items?.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <div className="fw-medium">{item.product_name ?? item.product?.name}</div>
                                            <div className="text-muted small">{item.product?.code}</div>
                                            {item.detail && <div className="text-muted small fst-italic">{item.detail}</div>}
                                        </td>
                                        <td className="text-end">{item.quantity}</td>
                                        <td className="text-end">{formatCurrency(item.sale_price)}</td>
                                        <td className="text-end">{formatCurrency(item.quantity * parseFloat(item.sale_price))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white"><h6 className="mb-0">{t('sales:sections.summary')}</h6></Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">{t('sales:fields.subtotal')}</span>
                                <span>{formatCurrency(sale.subtotal)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">{t('sales:fields.discount')}</span>
                                <span className="text-danger">-{formatCurrency(sale.discount)}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="d-flex justify-content-between fw-bold mb-3">
                                <span>{t('sales:fields.total')}</span>
                                <span className="text-primary fs-5">{total}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">{t('sales:fields.paid')}</span>
                                <span className="text-success fw-medium">{formatCurrency(sale.paid)}</span>
                            </div>
                            {sale.has_debt === 'yes' && (
                                <div className="d-flex justify-content-between">
                                    <span className="text-danger">{t('sales:fields.remaining')}</span>
                                    <span className="text-danger fw-medium">{remaining}</span>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <ConfirmModal
                show={annulModal}
                title={t('sales:annul.confirmTitle')}
                message={t('sales:annul.confirmMessage', { code: sale.code })}
                confirmLabel={t('sales:actions.annul')}
                confirmVariant="warning"
                loading={annulling}
                onConfirm={handleAnnul}
                onCancel={() => setAnnulModal(false)}
            />
        </MainLayout>
    );
}
