import { useState, useRef, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Button, Table, Alert, ListGroup } from 'react-bootstrap';
import { IconTrash, IconPlus, IconSearch } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

export default function PurchasesCreate({ providers, stores, products }) {
    const { t } = useTranslation(['purchases', 'common']);

    const { data, setData, post, processing, errors } = useForm({
        provider_id: '',
        store_id: '',
        invoice_number: '',
        purchase_date: new Date().toISOString().split('T')[0],
        tax: '0',
        discount: '0',
        observation: '',
        status: 'pending',
        items: [],
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [newItem, setNewItem] = useState({
        product_id: '',
        product_name: '',
        product_code: '',
        quantity: 1,
        unit_cost: '',
    });
    const searchRef = useRef(null);

    // Filter products based on search term
    const filteredProducts = products.filter(product => {
        const term = searchTerm.toLowerCase();
        return (
            product.code.toLowerCase().includes(term) ||
            product.name.toLowerCase().includes(term)
        );
    }).slice(0, 10); // Limit to 10 results

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);
    const tax = parseFloat(data.tax) || 0;
    const discount = parseFloat(data.discount) || 0;
    const total = subtotal + tax - discount;

    const handleSelectProduct = (product) => {
        setNewItem({
            product_id: product.id,
            product_name: product.name,
            product_code: product.code,
            quantity: 1,
            unit_cost: product.cost || '',
        });
        setSearchTerm(`${product.code} - ${product.name}`);
        setShowResults(false);
    };

    const handleAddItem = () => {
        if (!newItem.product_id || !newItem.quantity || !newItem.unit_cost) return;

        // Check if product already exists in items
        const existingIndex = data.items.findIndex(item => item.product_id === newItem.product_id);

        if (existingIndex >= 0) {
            // Update existing item
            const updatedItems = [...data.items];
            updatedItems[existingIndex].quantity += parseInt(newItem.quantity);
            setData('items', updatedItems);
        } else {
            // Add new item
            setData('items', [...data.items, {
                product_id: newItem.product_id,
                product_name: newItem.product_name,
                product_code: newItem.product_code,
                quantity: parseInt(newItem.quantity),
                unit_cost: parseFloat(newItem.unit_cost),
            }]);
        }

        // Reset form
        setNewItem({ product_id: '', product_name: '', product_code: '', quantity: 1, unit_cost: '' });
        setSearchTerm('');
    };

    const handleRemoveItem = (index) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('purchases.store'));
    };

    return (
        <MainLayout>
            <Head title={t('purchases:newPurchase')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('purchases:newPurchase')}
                    subtitle={t('purchases:subtitle')}
                    backRoute={route('purchases.index')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('purchases:title'), href: route('purchases.index') },
                        { label: t('purchases:newPurchase') },
                    ]}
                />

                <Form onSubmit={handleSubmit}>
                    {/* General Information */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('purchases:sections.generalInfo')}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {/* Invoice Number */}
                                <Col md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('purchases:fields.invoiceNumber')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={data.invoice_number}
                                            onChange={(e) => setData('invoice_number', e.target.value)}
                                            placeholder={t('purchases:placeholders.invoiceNumber')}
                                            isInvalid={!!errors.invoice_number}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.invoice_number}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Purchase Date */}
                                <Col md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('purchases:fields.purchaseDate')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={data.purchase_date}
                                            onChange={(e) => setData('purchase_date', e.target.value)}
                                            isInvalid={!!errors.purchase_date}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.purchase_date}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Status */}
                                <Col md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('purchases:fields.status')}</Form.Label>
                                        <Form.Select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            isInvalid={!!errors.status}
                                        >
                                            <option value="pending">{t('purchases:statuses.pending')}</option>
                                            <option value="completed">{t('purchases:statuses.completed')}</option>
                                            <option value="cancelled">{t('purchases:statuses.cancelled')}</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.status}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Provider */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('purchases:fields.provider')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={data.provider_id}
                                            onChange={(e) => setData('provider_id', e.target.value)}
                                            isInvalid={!!errors.provider_id}
                                        >
                                            <option value="">{t('purchases:placeholders.provider')}</option>
                                            {providers.map((provider) => (
                                                <option key={provider.id} value={provider.id}>
                                                    {provider.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.provider_id}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Store */}
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('purchases:fields.store')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={data.store_id}
                                            onChange={(e) => setData('store_id', e.target.value)}
                                            isInvalid={!!errors.store_id}
                                        >
                                            <option value="">{t('purchases:placeholders.store')}</option>
                                            {stores.map((store) => (
                                                <option key={store.id} value={store.id}>
                                                    {store.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.store_id}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Observation */}
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('purchases:fields.observation')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={data.observation}
                                            onChange={(e) => setData('observation', e.target.value)}
                                            placeholder={t('purchases:placeholders.observation')}
                                            isInvalid={!!errors.observation}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.observation}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Items */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('purchases:items.title')}</h5>
                        </Card.Header>
                        <Card.Body>
                            {/* Add Item Form */}
                            <Row className="mb-3 align-items-end">
                                <Col md={5}>
                                    <Form.Group ref={searchRef} className="position-relative">
                                        <Form.Label>{t('purchases:items.product')}</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setShowResults(true);
                                                    if (!e.target.value) {
                                                        setNewItem({ ...newItem, product_id: '', product_name: '', product_code: '' });
                                                    }
                                                }}
                                                onFocus={() => setShowResults(true)}
                                                placeholder={t('purchases:items.searchProduct')}
                                                autoComplete="off"
                                            />
                                            <IconSearch
                                                size={18}
                                                className="position-absolute text-muted"
                                                style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                                            />
                                        </div>
                                        {showResults && searchTerm && filteredProducts.length > 0 && (
                                            <ListGroup
                                                className="position-absolute w-100 shadow-sm"
                                                style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto' }}
                                            >
                                                {filteredProducts.map((product) => (
                                                    <ListGroup.Item
                                                        key={product.id}
                                                        action
                                                        onClick={() => handleSelectProduct(product)}
                                                        className="d-flex justify-content-between align-items-center"
                                                    >
                                                        <div>
                                                            <code className="me-2 text-primary">{product.code}</code>
                                                            <span>{product.name}</span>
                                                        </div>
                                                        {product.cost && (
                                                            <small className="text-muted">
                                                                Bs. {parseFloat(product.cost).toFixed(2)}
                                                            </small>
                                                        )}
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                        {showResults && searchTerm && filteredProducts.length === 0 && (
                                            <ListGroup
                                                className="position-absolute w-100 shadow-sm"
                                                style={{ zIndex: 1000 }}
                                            >
                                                <ListGroup.Item className="text-muted text-center">
                                                    {t('purchases:items.noProductsFound')}
                                                </ListGroup.Item>
                                            </ListGroup>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>{t('purchases:items.quantity')}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={newItem.quantity}
                                            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>{t('purchases:items.unitCost')}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newItem.unit_cost}
                                            onChange={(e) => setNewItem({ ...newItem, unit_cost: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="success"
                                        onClick={handleAddItem}
                                        disabled={!newItem.product_id || !newItem.quantity || !newItem.unit_cost}
                                    >
                                        <IconPlus size={18} className="me-1" />
                                        {t('purchases:items.addItem')}
                                    </Button>
                                </Col>
                            </Row>

                            {errors.items && (
                                <Alert variant="danger" className="mb-3">
                                    {t('purchases:messages.minOneItem')}
                                </Alert>
                            )}

                            {/* Items Table */}
                            <Table bordered hover responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '50px' }}>#</th>
                                        <th>{t('purchases:items.product')}</th>
                                        <th style={{ width: '120px' }}>{t('purchases:items.quantity')}</th>
                                        <th style={{ width: '150px' }}>{t('purchases:items.unitCost')}</th>
                                        <th style={{ width: '150px' }}>{t('purchases:items.subtotal')}</th>
                                        <th style={{ width: '80px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center text-muted py-4">
                                                {t('purchases:items.noItems')}
                                            </td>
                                        </tr>
                                    ) : (
                                        data.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <code className="me-2">{item.product_code}</code>
                                                    {item.product_name}
                                                </td>
                                                <td className="text-center">{item.quantity}</td>
                                                <td className="text-end">Bs. {item.unit_cost.toFixed(2)}</td>
                                                <td className="text-end fw-medium">
                                                    Bs. {(item.quantity * item.unit_cost).toFixed(2)}
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveItem(index)}
                                                    >
                                                        <IconTrash size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    {/* Summary */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('purchases:sections.summary')}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row className="justify-content-end">
                                <Col md={4}>
                                    <Table borderless size="sm">
                                        <tbody>
                                            <tr>
                                                <td>{t('purchases:fields.subtotal')}:</td>
                                                <td className="text-end">Bs. {subtotal.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        size="sm"
                                                        step="0.01"
                                                        min="0"
                                                        value={data.tax}
                                                        onChange={(e) => setData('tax', e.target.value)}
                                                        style={{ width: '100px', display: 'inline' }}
                                                        className="me-2"
                                                    />
                                                    {t('purchases:fields.tax')}:
                                                </td>
                                                <td className="text-end">Bs. {tax.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        size="sm"
                                                        step="0.01"
                                                        min="0"
                                                        value={data.discount}
                                                        onChange={(e) => setData('discount', e.target.value)}
                                                        style={{ width: '100px', display: 'inline' }}
                                                        className="me-2"
                                                    />
                                                    {t('purchases:fields.discount')}:
                                                </td>
                                                <td className="text-end text-danger">- Bs. {discount.toFixed(2)}</td>
                                            </tr>
                                            <tr className="border-top">
                                                <td className="fw-bold fs-5">{t('purchases:fields.total')}:</td>
                                                <td className="text-end fw-bold fs-5 text-success">
                                                    Bs. {total.toFixed(2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
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
                        <Button type="submit" variant="primary" disabled={processing || data.items.length === 0}>
                            {processing ? t('common:actions.saving') : t('common:actions.save')}
                        </Button>
                    </div>
                </Form>
            </div>
        </MainLayout>
    );
}
