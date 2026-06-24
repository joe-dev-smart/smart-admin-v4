import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Button, Badge, Table } from 'react-bootstrap';
import { IconPackage, IconEdit, IconArrowLeft, IconTag, IconCategory, IconRuler, IconCurrencyDollar } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, StatusBadge } from '@/components/ui';

const formatPrice = (val) =>
    val != null ? `${parseFloat(val).toFixed(2)}` : '-';

export default function ProductsShow({ product, stocks = [] }) {
    const { t } = useTranslation(['products', 'common']);

    const typeLabel = {
        product: t('products:types.product'),
        perishable_product: t('products:types.perishable_product'),
        service: t('products:types.service'),
    }[product.type] ?? product.type;

    const unitLabel = {
        unit: t('products:units.unit'),
        piece: t('products:units.piece'),
        meter: t('products:units.meter'),
        package: t('products:units.package'),
        kilo: t('products:units.kilo'),
        litre: t('products:units.litre'),
    }[product.unit_of_measurement] ?? product.unit_of_measurement;

    const totalStock = stocks.reduce((sum, s) => sum + (parseInt(s.quantity) || 0), 0);

    return (
        <MainLayout>
            <Head title={product.name} />

            <PageHeader
                title={product.name}
                subtitle={product.code}
                breadcrumbs={[
                    { label: t('products:title'), href: route('products.index') },
                    { label: product.name },
                ]}
                actions={
                    <div className="d-flex gap-2">
                        <Link href={route('products.index')}>
                            <Button variant="outline-secondary" size="sm">
                                <IconArrowLeft size={16} className="me-1" />
                                {t('common:actions.back')}
                            </Button>
                        </Link>
                        <Link href={route('products.edit', product.id)}>
                            <Button variant="primary" size="sm">
                                <IconEdit size={16} className="me-1" />
                                {t('common:actions.edit')}
                            </Button>
                        </Link>
                    </div>
                }
            />

            <Row className="g-3">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <div className="d-flex align-items-center gap-2">
                                <IconPackage size={20} className="text-primary" />
                                <h6 className="mb-0">{t('products:create.title')}</h6>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('products:fields.name')}</p>
                                    <p className="fw-medium mb-0">{product.name}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('products:fields.code')}</p>
                                    <code className="text-primary">{product.code}</code>
                                </Col>
                                {product.barcode && (
                                    <Col sm={6}>
                                        <p className="text-muted small mb-1">{t('products:fields.barcode')}</p>
                                        <p className="mb-0">{product.barcode}</p>
                                    </Col>
                                )}
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('products:fields.type')}</p>
                                    <Badge bg="info" className="text-white">{typeLabel}</Badge>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('products:fields.unitOfMeasurement')}</p>
                                    <span className="d-flex align-items-center gap-1">
                                        <IconRuler size={14} className="text-muted" />
                                        {unitLabel}
                                    </span>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('products:fields.minimumStock')}</p>
                                    <p className="mb-0">{product.minimum_stock ?? 0}</p>
                                </Col>
                                {product.category && (
                                    <Col sm={6}>
                                        <p className="text-muted small mb-1">{t('products:fields.category')}</p>
                                        <span className="d-flex align-items-center gap-1">
                                            <IconCategory size={14} className="text-muted" />
                                            {product.category.name}
                                        </span>
                                    </Col>
                                )}
                                {product.brand && (
                                    <Col sm={6}>
                                        <p className="text-muted small mb-1">{t('products:fields.brand')}</p>
                                        <span className="d-flex align-items-center gap-1">
                                            <IconTag size={14} className="text-muted" />
                                            {product.brand.name}
                                        </span>
                                    </Col>
                                )}
                                {(product.model || product.size || product.color) && (
                                    <>
                                        {product.model && (
                                            <Col sm={4}>
                                                <p className="text-muted small mb-1">{t('products:fields.model')}</p>
                                                <p className="mb-0">{product.model}</p>
                                            </Col>
                                        )}
                                        {product.size && (
                                            <Col sm={4}>
                                                <p className="text-muted small mb-1">{t('products:fields.size')}</p>
                                                <p className="mb-0">{product.size}</p>
                                            </Col>
                                        )}
                                        {product.color && (
                                            <Col sm={4}>
                                                <p className="text-muted small mb-1">{t('products:fields.color')}</p>
                                                <p className="mb-0">{product.color}</p>
                                            </Col>
                                        )}
                                    </>
                                )}
                                {product.description && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('products:fields.description')}</p>
                                        <p className="mb-0">{product.description}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>

                    {stocks.length > 0 && (
                        <Card className="shadow-sm mt-3">
                            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">{t('common:nav.stock', 'Stock by Store')}</h6>
                                <Badge bg={totalStock <= (product.minimum_stock ?? 0) ? 'danger' : 'success'}>
                                    {t('common:table.total', 'Total')}: {totalStock}
                                </Badge>
                            </Card.Header>
                            <Table size="sm" className="mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>{t('common:nav.stores', 'Store')}</th>
                                        <th className="text-end">{t('common:table.quantity', 'Quantity')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.map(stock => (
                                        <tr key={stock.id}>
                                            <td>{stock.store?.name ?? '-'}</td>
                                            <td className="text-end">
                                                <Badge bg={stock.quantity <= 0 ? 'danger' : 'success'}>
                                                    {stock.quantity}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    )}
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <div className="d-flex align-items-center gap-2">
                                <IconCurrencyDollar size={20} className="text-success" />
                                <h6 className="mb-0">{t('products:sections.prices', 'Prices')}</h6>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {[
                                { key: 'salePrice1', val: product.sale_price_1 },
                                { key: 'salePrice2', val: product.sale_price_2 },
                                { key: 'salePrice3', val: product.sale_price_3 },
                                { key: 'salePrice4', val: product.sale_price_4 },
                            ].map(({ key, val }) => (
                                <div key={key} className="d-flex justify-content-between mb-2">
                                    <span className="text-muted small">{t(`products:fields.${key}`)}</span>
                                    <span className="fw-medium">{formatPrice(val)}</span>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mt-3">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">{t('products:fields.status')}</h6>
                        </Card.Header>
                        <Card.Body>
                            <StatusBadge status={product.status} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
}
