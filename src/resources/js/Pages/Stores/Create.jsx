import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

export default function StoresCreate() {
    const { t } = useTranslation(['stores', 'common']);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        address: '',
        google_maps_url: '',
        description: '',
        allow_sales: 'enabled',
        status: 'enabled',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('stores.store'));
    };

    return (
        <MainLayout>
            <Head title={t('stores:create.title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('stores:create.title')}
                    subtitle={t('stores:create.subtitle')}
                    backRoute={route('stores.index')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('stores:title'), href: route('stores.index') },
                        { label: t('stores:create.title') },
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
                                            {t('stores:fields.name')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('stores:fields.namePlaceholder')}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Phone */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('stores:fields.phone')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder={t('stores:fields.phonePlaceholder')}
                                            isInvalid={!!errors.phone}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.phone}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Address */}
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('stores:fields.address')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder={t('stores:fields.addressPlaceholder')}
                                            isInvalid={!!errors.address}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.address}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Google Maps URL */}
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('stores:fields.googleMapsUrl')}</Form.Label>
                                        <Form.Control
                                            type="url"
                                            value={data.google_maps_url}
                                            onChange={(e) => setData('google_maps_url', e.target.value)}
                                            placeholder={t('stores:fields.googleMapsUrlPlaceholder')}
                                            isInvalid={!!errors.google_maps_url}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.google_maps_url}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Description */}
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('stores:fields.description')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={t('stores:fields.descriptionPlaceholder')}
                                            isInvalid={!!errors.description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Allow Sales */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('stores:fields.allowSales')}</Form.Label>
                                        <Form.Select
                                            value={data.allow_sales}
                                            onChange={(e) => setData('allow_sales', e.target.value)}
                                            isInvalid={!!errors.allow_sales}
                                        >
                                            <option value="enabled">{t('common:status.enabled')}</option>
                                            <option value="disabled">{t('common:status.disabled')}</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.allow_sales}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Status */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('stores:fields.status')}</Form.Label>
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
