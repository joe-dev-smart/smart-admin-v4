import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

export default function ProductsEdit({ product, categories, brands }) {
    const { t } = useTranslation(['products', 'common']);

    const { data, setData, put, processing, errors } = useForm({
        category_id: product.category_id || '',
        brand_id: product.brand_id || '',
        name: product.name || '',
        code: product.code || '',
        barcode: product.barcode || '',
        type: product.type || 'product',
        unit_of_measurement: product.unit_of_measurement || 'unit',
        sale_price_1: product.sale_price_1 || '',
        sale_price_2: product.sale_price_2 || '',
        sale_price_3: product.sale_price_3 || '',
        sale_price_4: product.sale_price_4 || '',
        minimum_stock: product.minimum_stock || '0',
        model: product.model || '',
        size: product.size || '',
        color: product.color || '',
        description: product.description || '',
        status: product.status || 'enabled',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <MainLayout>
            <Head title={`${t('products:edit.title')} - ${product.name}`} />

            <div className="container-fluid">
                <PageHeader
                    title={t('products:edit.title')}
                    subtitle={t('products:edit.subtitle')}
                    backRoute={route('products.index')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('products:title'), href: route('products.index') },
                        { label: t('products:edit.title') },
                    ]}
                />

                <Form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('products:sections.basicInfo')}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {/* Name */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('products:fields.name')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('products:fields.namePlaceholder')}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Code */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('products:fields.code')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder={t('products:fields.codePlaceholder')}
                                            isInvalid={!!errors.code}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.code}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Barcode */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('products:fields.barcode')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.barcode}
                                            onChange={(e) => setData('barcode', e.target.value)}
                                            placeholder={t('products:fields.barcodePlaceholder')}
                                            isInvalid={!!errors.barcode}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.barcode}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Category */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('products:fields.category')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            isInvalid={!!errors.category_id}
                                        >
                                            <option value="">{t('products:fields.categoryPlaceholder')}</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.category_id}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Brand */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('products:fields.brand')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={data.brand_id}
                                            onChange={(e) => setData('brand_id', e.target.value)}
                                            isInvalid={!!errors.brand_id}
                                        >
                                            <option value="">{t('products:fields.brandPlaceholder')}</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.brand_id}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Type */}
                                <Col md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('products:fields.type')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            isInvalid={!!errors.type}
                                        >
                                            <option value="product">{t('products:types.product')}</option>
                                            <option value="perishable_product">{t('products:types.perishable_product')}</option>
                                            <option value="service">{t('products:types.service')}</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.type}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Unit of Measurement */}
                                <Col md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('products:fields.unitOfMeasurement')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={data.unit_of_measurement}
                                            onChange={(e) => setData('unit_of_measurement', e.target.value)}
                                            isInvalid={!!errors.unit_of_measurement}
                                        >
                                            <option value="unit">{t('products:units.unit')}</option>
                                            <option value="piece">{t('products:units.piece')}</option>
                                            <option value="meter">{t('products:units.meter')}</option>
                                            <option value="package">{t('products:units.package')}</option>
                                            <option value="kilo">{t('products:units.kilo')}</option>
                                            <option value="litre">{t('products:units.litre')}</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.unit_of_measurement}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Status */}
                                <Col md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('products:fields.status')}</Form.Label>
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
                        </Card.Body>
                    </Card>

                    {/* Pricing */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('products:sections.pricing')}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {/* Sale Price 1 */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('products:fields.salePrice1')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.sale_price_1}
                                            onChange={(e) => setData('sale_price_1', e.target.value)}
                                            placeholder={t('products:fields.salePrice1Placeholder')}
                                            isInvalid={!!errors.sale_price_1}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.sale_price_1}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Sale Price 2 */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('products:fields.salePrice2')}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.sale_price_2}
                                            onChange={(e) => setData('sale_price_2', e.target.value)}
                                            placeholder={t('products:fields.salePrice2Placeholder')}
                                            isInvalid={!!errors.sale_price_2}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.sale_price_2}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Sale Price 3 */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('products:fields.salePrice3')}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.sale_price_3}
                                            onChange={(e) => setData('sale_price_3', e.target.value)}
                                            placeholder={t('products:fields.salePrice3Placeholder')}
                                            isInvalid={!!errors.sale_price_3}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.sale_price_3}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Sale Price 4 */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('products:fields.salePrice4')}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.sale_price_4}
                                            onChange={(e) => setData('sale_price_4', e.target.value)}
                                            placeholder={t('products:fields.salePrice4Placeholder')}
                                            isInvalid={!!errors.sale_price_4}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.sale_price_4}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Minimum Stock */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('products:fields.minimumStock')}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            value={data.minimum_stock}
                                            onChange={(e) => setData('minimum_stock', e.target.value)}
                                            placeholder={t('products:fields.minimumStockPlaceholder')}
                                            isInvalid={!!errors.minimum_stock}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.minimum_stock}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Details */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('products:sections.details')}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {/* Model */}
                                <Col md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('products:fields.model')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.model}
                                            onChange={(e) => setData('model', e.target.value)}
                                            placeholder={t('products:fields.modelPlaceholder')}
                                            isInvalid={!!errors.model}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.model}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Size */}
                                <Col md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('products:fields.size')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.size}
                                            onChange={(e) => setData('size', e.target.value)}
                                            placeholder={t('products:fields.sizePlaceholder')}
                                            isInvalid={!!errors.size}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.size}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Color */}
                                <Col md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('products:fields.color')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            placeholder={t('products:fields.colorPlaceholder')}
                                            isInvalid={!!errors.color}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.color}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Description */}
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('products:fields.description')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={t('products:fields.descriptionPlaceholder')}
                                            isInvalid={!!errors.description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Form Actions */}
                    <div className="d-flex justify-content-end gap-2">
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
            </div>
        </MainLayout>
    );
}
