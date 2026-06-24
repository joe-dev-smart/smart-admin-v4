import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { IconArrowsExchange, IconEdit, IconArrowLeft, IconCalendar } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

const typeColors = { add: 'success', transfer: 'primary', remove: 'danger' };
const statusColors = { pending: 'warning', in_transit: 'info', completed: 'success', cancelled: 'danger' };

export default function TransfersShow({ transfer }) {
    const { t } = useTranslation(['transfers', 'common']);

    return (
        <MainLayout>
            <Head title={`${t('transfers:single')} ${transfer.code}`} />

            <PageHeader
                title={`${t('transfers:single')}: ${transfer.code}`}
                subtitle={t(`transfers:types.${transfer.type}`)}
                breadcrumbs={[
                    { label: t('transfers:title'), href: route('transfers.index') },
                    { label: transfer.code },
                ]}
                actions={
                    <div className="d-flex gap-2">
                        <Link href={route('transfers.index')}>
                            <Button variant="outline-secondary" size="sm">
                                <IconArrowLeft size={16} className="me-1" />
                                {t('common:actions.back')}
                            </Button>
                        </Link>
                        {transfer.status !== 'cancelled' && transfer.status !== 'completed' && (
                            <Link href={route('transfers.edit', transfer.id)}>
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
                                <IconArrowsExchange size={20} className="text-primary" />
                                <h6 className="mb-0">{t('transfers:sections.generalInfo')}</h6>
                            </div>
                            <div className="d-flex gap-2">
                                <Badge bg={typeColors[transfer.type] ?? 'secondary'}>
                                    {t(`transfers:types.${transfer.type}`)}
                                </Badge>
                                <Badge bg={statusColors[transfer.status] ?? 'secondary'}>
                                    {t(`transfers:statuses.${transfer.status}`)}
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('transfers:fields.code')}</p>
                                    <code className="text-primary">{transfer.code}</code>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('transfers:fields.transferDate')}</p>
                                    <span className="d-flex align-items-center gap-1">
                                        <IconCalendar size={14} className="text-muted" />
                                        {transfer.transfer_date}
                                    </span>
                                </Col>
                                {transfer.from_store && (
                                    <Col sm={6}>
                                        <p className="text-muted small mb-1">{t('transfers:fields.fromStore')}</p>
                                        <p className="mb-0 fw-medium">{transfer.from_store.name}</p>
                                    </Col>
                                )}
                                {transfer.to_store && (
                                    <Col sm={6}>
                                        <p className="text-muted small mb-1">{t('transfers:fields.toStore')}</p>
                                        <p className="mb-0 fw-medium">{transfer.to_store.name}</p>
                                    </Col>
                                )}
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('transfers:fields.createdBy')}</p>
                                    <p className="mb-0">{transfer.user?.name ?? '-'}</p>
                                </Col>
                                {transfer.observation && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('transfers:fields.observation')}</p>
                                        <p className="mb-0">{transfer.observation}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mt-3">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">{t('transfers:sections.items')}</h6>
                        </Card.Header>
                        <Table size="sm" className="mb-0" responsive>
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>{t('transfers:items.product')}</th>
                                    <th className="text-end">{t('transfers:items.quantity')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfer.items?.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <div className="fw-medium">{item.product?.name ?? '-'}</div>
                                            <div className="text-muted small">{item.product?.code}</div>
                                        </td>
                                        <td className="text-end">{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
}
