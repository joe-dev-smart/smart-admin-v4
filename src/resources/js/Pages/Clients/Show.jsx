import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { IconUsers, IconPhone, IconMail, IconMapPin, IconEdit, IconArrowLeft } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, StatusBadge } from '@/components/ui';

export default function ClientsShow({ client }) {
    const { t } = useTranslation(['clients', 'common']);

    return (
        <MainLayout>
            <Head title={client.name} />

            <PageHeader
                title={client.name}
                subtitle={t('clients:edit.subtitle')}
                breadcrumbs={[
                    { label: t('clients:title'), href: route('clients.index') },
                    { label: client.name },
                ]}
                actions={
                    <div className="d-flex gap-2">
                        <Link href={route('clients.index')}>
                            <Button variant="outline-secondary" size="sm">
                                <IconArrowLeft size={16} className="me-1" />
                                {t('common:actions.back')}
                            </Button>
                        </Link>
                        <Link href={route('clients.edit', client.id)}>
                            <Button variant="primary" size="sm">
                                <IconEdit size={16} className="me-1" />
                                {t('common:actions.edit')}
                            </Button>
                        </Link>
                    </div>
                }
            />

            <Row>
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <div className="d-flex align-items-center gap-2">
                                <IconUsers size={20} className="text-primary" />
                                <h6 className="mb-0">{t('clients:title')}</h6>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('clients:fields.name')}</p>
                                    <p className="fw-medium mb-0">{client.name}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('clients:fields.nit')}</p>
                                    <p className="mb-0">{client.nit || '-'}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('clients:fields.email')}</p>
                                    <p className="mb-0">
                                        {client.email ? (
                                            <span className="d-flex align-items-center gap-1">
                                                <IconMail size={14} className="text-muted" />
                                                {client.email}
                                            </span>
                                        ) : '-'}
                                    </p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('clients:fields.phone')}</p>
                                    <p className="mb-0">
                                        {client.phone ? (
                                            <span className="d-flex align-items-center gap-1">
                                                <IconPhone size={14} className="text-muted" />
                                                {client.phone}
                                            </span>
                                        ) : '-'}
                                    </p>
                                </Col>
                                <Col sm={12}>
                                    <p className="text-muted small mb-1">{t('clients:fields.address')}</p>
                                    <p className="mb-0">
                                        {client.address ? (
                                            <span className="d-flex align-items-center gap-1">
                                                <IconMapPin size={14} className="text-muted" />
                                                {client.address}
                                            </span>
                                        ) : '-'}
                                    </p>
                                </Col>
                                {client.observation && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('clients:fields.observation')}</p>
                                        <p className="mb-0">{client.observation}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">{t('clients:fields.status')}</h6>
                        </Card.Header>
                        <Card.Body>
                            <StatusBadge status={client.status} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
}
