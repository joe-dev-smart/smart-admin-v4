import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { IconTag, IconEdit, IconArrowLeft } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, StatusBadge } from '@/components/ui';

export default function BrandsShow({ brand }) {
    const { t } = useTranslation(['brands', 'common']);

    return (
        <MainLayout>
            <Head title={brand.name} />

            <PageHeader
                title={brand.name}
                subtitle={t('brands:edit.subtitle')}
                breadcrumbs={[
                    { label: t('brands:title'), href: route('brands.index') },
                    { label: brand.name },
                ]}
                actions={
                    <div className="d-flex gap-2">
                        <Link href={route('brands.index')}>
                            <Button variant="outline-secondary" size="sm">
                                <IconArrowLeft size={16} className="me-1" />
                                {t('common:actions.back')}
                            </Button>
                        </Link>
                        <Link href={route('brands.edit', brand.id)}>
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
                                <IconTag size={20} className="text-primary" />
                                <h6 className="mb-0">{t('brands:title')}</h6>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('brands:fields.name')}</p>
                                    <p className="fw-medium mb-0">{brand.name}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('brands:fields.status')}</p>
                                    <StatusBadge status={brand.status} />
                                </Col>
                                {brand.description && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('brands:fields.description')}</p>
                                        <p className="mb-0">{brand.description}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
}
