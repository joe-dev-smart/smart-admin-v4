import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

export default function ProvidersCreate() {
    const { t } = useTranslation(['providers', 'common']);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        nit: '',
        email: '',
        cellphone: '',
        cellphone_2: '',
        phone: '',
        phone_2: '',
        address: '',
        observation: '',
        status: 'enabled',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('providers.store'));
    };

    return (
        <MainLayout>
            <Head title={t('providers:create.title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('providers:create.title')}
                    subtitle={t('providers:create.subtitle')}
                    backRoute={route('providers.index')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('providers:title'), href: route('providers.index') },
                        { label: t('providers:create.title') },
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
                                            {t('providers:fields.name')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('providers:fields.namePlaceholder')}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* NIT */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('providers:fields.nit')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.nit}
                                            onChange={(e) => setData('nit', e.target.value)}
                                            placeholder={t('providers:fields.nitPlaceholder')}
                                            isInvalid={!!errors.nit}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.nit}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Email */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('providers:fields.email')}</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder={t('providers:fields.emailPlaceholder')}
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Cellphone */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('providers:fields.cellphone')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.cellphone}
                                            onChange={(e) => setData('cellphone', e.target.value)}
                                            placeholder={t('providers:fields.cellphonePlaceholder')}
                                            isInvalid={!!errors.cellphone}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cellphone}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Cellphone 2 */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('providers:fields.cellphone2')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.cellphone_2}
                                            onChange={(e) => setData('cellphone_2', e.target.value)}
                                            placeholder={t('providers:fields.cellphone2Placeholder')}
                                            isInvalid={!!errors.cellphone_2}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cellphone_2}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Phone */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('providers:fields.phone')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder={t('providers:fields.phonePlaceholder')}
                                            isInvalid={!!errors.phone}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.phone}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Phone 2 */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('providers:fields.phone2')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.phone_2}
                                            onChange={(e) => setData('phone_2', e.target.value)}
                                            placeholder={t('providers:fields.phone2Placeholder')}
                                            isInvalid={!!errors.phone_2}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.phone_2}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Status */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('providers:fields.status')}</Form.Label>
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

                                {/* Address */}
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('providers:fields.address')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder={t('providers:fields.addressPlaceholder')}
                                            isInvalid={!!errors.address}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.address}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Observation */}
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('providers:fields.observation')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={data.observation}
                                            onChange={(e) => setData('observation', e.target.value)}
                                            placeholder={t('providers:fields.observationPlaceholder')}
                                            isInvalid={!!errors.observation}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.observation}
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
