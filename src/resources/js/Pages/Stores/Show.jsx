import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { IconBuildingStore, IconPhone, IconMapPin, IconEdit, IconArrowLeft, IconMap } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, StatusBadge } from '@/components/ui';

export default function StoresShow({ store }) {
    const { t } = useTranslation(['stores', 'common']);

    return (
        <MainLayout>
            <Head title={store.name} />

            <PageHeader
                title={store.name}
                subtitle={t('stores:edit.subtitle')}
                breadcrumbs={[
                    { label: t('stores:title'), href: route('stores.index') },
                    { label: store.name },
                ]}
                actions={
                    <div className="d-flex gap-2">
                        <Link href={route('stores.index')}>
                            <Button variant="outline-secondary" size="sm">
                                <IconArrowLeft size={16} className="me-1" />
                                {t('common:actions.back')}
                            </Button>
                        </Link>
                        <Link href={route('stores.edit', store.id)}>
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
                                <IconBuildingStore size={20} className="text-primary" />
                                <h6 className="mb-0">{t('common:actions.view')} {t('stores:singular')}</h6>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('stores:fields.name')}</p>
                                    <p className="fw-medium mb-0">{store.name}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('stores:fields.phone')}</p>
                                    <p className="mb-0">
                                        {store.phone ? (
                                            <span className="d-flex align-items-center gap-1">
                                                <IconPhone size={14} className="text-muted" />
                                                {store.phone}
                                            </span>
                                        ) : '-'}
                                    </p>
                                </Col>
                                <Col sm={12}>
                                    <p className="text-muted small mb-1">{t('stores:fields.address')}</p>
                                    <p className="mb-0">
                                        {store.address ? (
                                            <span className="d-flex align-items-center gap-1">
                                                <IconMapPin size={14} className="text-muted" />
                                                {store.address}
                                            </span>
                                        ) : '-'}
                                    </p>
                                </Col>
                                {store.google_maps_url && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('stores:fields.googleMapsUrl')}</p>
                                        <a href={store.google_maps_url} target="_blank" rel="noopener noreferrer"
                                            className="d-flex align-items-center gap-1 text-primary">
                                            <IconMap size={14} />
                                            {t('common:actions.view')} Google Maps
                                        </a>
                                    </Col>
                                )}
                                {store.description && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('stores:fields.description')}</p>
                                        <p className="mb-0">{store.description}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">{t('common:status.all')}</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <p className="text-muted small mb-1">{t('stores:fields.status')}</p>
                                <StatusBadge status={store.status} />
                            </div>
                            <div>
                                <p className="text-muted small mb-1">{t('stores:fields.allowSales')}</p>
                                <Badge bg={store.allow_sales === 'enabled' ? 'success' : 'secondary'}>
                                    {store.allow_sales === 'enabled' ? t('common:status.enabled') : t('common:status.disabled')}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
}
