import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

export default function BrandsEdit({ brand }) {
    const { t } = useTranslation(['brands', 'common']);

    const { data, setData, put, processing, errors } = useForm({
        name: brand.name || '',
        description: brand.description || '',
        status: brand.status || 'enabled',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('brands.update', brand.id));
    };

    return (
        <MainLayout>
            <Head title={`${t('brands:edit.title')} - ${brand.name}`} />

            <div className="container-fluid">
                <PageHeader
                    title={t('brands:edit.title')}
                    subtitle={t('brands:edit.subtitle')}
                    backRoute={route('brands.index')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('brands:title'), href: route('brands.index') },
                        { label: t('brands:edit.title') },
                    ]}
                />

                <Card>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                {/* Name */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('brands:fields.name')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('brands:fields.namePlaceholder')}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Status */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('brands:fields.status')}</Form.Label>
                                        <Form.Select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            isInvalid={!!errors.status}
                                        >
                                            <option value="enabled">{t('common:status.enabled')}</option>
                                            <option value="disabled">{t('common:status.disabled')}</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.status}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Description */}
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('brands:fields.description')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={t('brands:fields.descriptionPlaceholder')}
                                            isInvalid={!!errors.description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Form Actions */}
                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                >
                                    {t('common:actions.cancel')}
                                </Button>
                                <Button type="submit" variant="primary" disabled={processing}>
                                    {processing ? t('common:actions.saving') : t('common:actions.save')}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </MainLayout>
    );
}
