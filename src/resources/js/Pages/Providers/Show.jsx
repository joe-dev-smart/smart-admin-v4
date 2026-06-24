import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { IconTruck, IconPhone, IconMail, IconMapPin, IconEdit, IconArrowLeft } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, StatusBadge } from '@/components/ui';

export default function ProvidersShow({ provider }) {
    const { t } = useTranslation(['providers', 'common']);

    return (
        <MainLayout>
            <Head title={provider.name} />

            <PageHeader
                title={provider.name}
                subtitle={t('providers:edit.subtitle')}
                breadcrumbs={[
                    { label: t('providers:title'), href: route('providers.index') },
                    { label: provider.name },
                ]}
                actions={
                    <div className="d-flex gap-2">
                        <Link href={route('providers.index')}>
                            <Button variant="outline-secondary" size="sm">
                                <IconArrowLeft size={16} className="me-1" />
                                {t('common:actions.back')}
                            </Button>
                        </Link>
                        <Link href={route('providers.edit', provider.id)}>
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
                                <IconTruck size={20} className="text-primary" />
                                <h6 className="mb-0">{t('providers:title')}</h6>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('providers:fields.name')}</p>
                                    <p className="fw-medium mb-0">{provider.name}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('providers:fields.nit')}</p>
                                    <p className="mb-0">{provider.nit || '-'}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('providers:fields.email')}</p>
                                    <p className="mb-0">
                                        {provider.email ? (
                                            <span className="d-flex align-items-center gap-1">
                                                <IconMail size={14} className="text-muted" />
                                                {provider.email}
                                            </span>
                                        ) : '-'}
                                    </p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('providers:fields.cellphone')}</p>
                                    <p className="mb-0">
                                        {provider.cellphone ? (
                                            <span className="d-flex align-items-center gap-1">
                                                <IconPhone size={14} className="text-muted" />
                                                {provider.cellphone}
                                                {provider.cellphone_2 && ` / ${provider.cellphone_2}`}
                                            </span>
                                        ) : '-'}
                                    </p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('providers:fields.phone')}</p>
                                    <p className="mb-0">
                                        {provider.phone ? (
                                            <span className="d-flex align-items-center gap-1">
                                                <IconPhone size={14} className="text-muted" />
                                                {provider.phone}
                                                {provider.phone_2 && ` / ${provider.phone_2}`}
                                            </span>
                                        ) : '-'}
                                    </p>
                                </Col>
                                <Col sm={12}>
                                    <p className="text-muted small mb-1">{t('providers:fields.address')}</p>
                                    <p className="mb-0">
                                        {provider.address ? (
                                            <span className="d-flex align-items-center gap-1">
                                                <IconMapPin size={14} className="text-muted" />
                                                {provider.address}
                                            </span>
                                        ) : '-'}
                                    </p>
                                </Col>
                                {provider.observation && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('providers:fields.observation')}</p>
                                        <p className="mb-0">{provider.observation}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">{t('providers:fields.status')}</h6>
                        </Card.Header>
                        <Card.Body>
                            <StatusBadge status={provider.status} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
}
