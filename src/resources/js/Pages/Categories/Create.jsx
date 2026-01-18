import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

export default function CategoriesCreate({ parentCategories }) {
    const { t } = useTranslation(['categories', 'common']);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        parent_id: '',
        description: '',
        status: 'enabled',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <MainLayout>
            <Head title={t('categories:create.title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('categories:create.title')}
                    subtitle={t('categories:create.subtitle')}
                    backRoute={route('categories.index')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('categories:title'), href: route('categories.index') },
                        { label: t('categories:create.title') },
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
                                            {t('categories:fields.name')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('categories:fields.namePlaceholder')}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Parent Category */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('categories:fields.parent')}</Form.Label>
                                        <Form.Select
                                            value={data.parent_id}
                                            onChange={(e) => setData('parent_id', e.target.value)}
                                            isInvalid={!!errors.parent_id}
                                        >
                                            <option value="">{t('categories:fields.noParent')}</option>
                                            {parentCategories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.parent_id}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Description */}
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('categories:fields.description')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={t('categories:fields.descriptionPlaceholder')}
                                            isInvalid={!!errors.description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Status */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('categories:fields.status')}</Form.Label>
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
