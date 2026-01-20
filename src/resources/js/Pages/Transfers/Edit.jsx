import { useState, useRef, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Button, Table, Alert, ListGroup } from 'react-bootstrap';
import { IconTrash, IconPlus, IconSearch } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

export default function TransfersEdit({ transfer, stores, products }) {
    const { t } = useTranslation(['transfers', 'common']);

    const { data, setData, put, processing, errors } = useForm({
        type: transfer.type || 'transfer',
        from_store_id: transfer.from_store_id || '',
        to_store_id: transfer.to_store_id || '',
        transfer_date: transfer.transfer_date.split('T')[0],
        observation: transfer.observation || '',
        status: transfer.status,
        items: transfer.items.map(item => ({
            product_id: item.product_id,
            product_name: item.product.name,
            product_code: item.product.code,
            quantity: item.quantity,
        })),
    });

    // Handle type change - reset store fields based on type
    const handleTypeChange = (newType) => {
        setData(data => ({
            ...data,
            type: newType,
            from_store_id: newType === 'add' ? '' : data.from_store_id,
            to_store_id: newType === 'remove' ? '' : data.to_store_id,
        }));
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [newItem, setNewItem] = useState({
        product_id: '',
        product_name: '',
        product_code: '',
        quantity: 1,
    });
    const searchRef = useRef(null);

    // Filter products based on search term
    const filteredProducts = products.filter(product => {
        const term = searchTerm.toLowerCase();
        return (
            product.code.toLowerCase().includes(term) ||
            product.name.toLowerCase().includes(term)
        );
    }).slice(0, 10);

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

    const handleSelectProduct = (product) => {
        setNewItem({
            product_id: product.id,
            product_name: product.name,
            product_code: product.code,
            quantity: 1,
        });
        setSearchTerm(`${product.code} - ${product.name}`);
        setShowResults(false);
    };

    const handleAddItem = () => {
        if (!newItem.product_id || !newItem.quantity) return;

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
            }]);
        }

        // Reset form
        setNewItem({ product_id: '', product_name: '', product_code: '', quantity: 1 });
        setSearchTerm('');
    };

    const handleRemoveItem = (index) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('transfers.update', transfer.id));
    };

    return (
        <MainLayout>
            <Head title={t('transfers:editTransfer')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('transfers:editTransfer')}
                    subtitle={`${t('transfers:fields.code')}: ${transfer.code}`}
                    backRoute={route('transfers.index')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('transfers:title'), href: route('transfers.index') },
                        { label: t('transfers:editTransfer') },
                    ]}
                />

                <Form onSubmit={handleSubmit}>
                    {/* General Information */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">{t('transfers:sections.generalInfo')}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {/* Code (read-only) */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('transfers:fields.code')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={transfer.code}
                                            readOnly
                                            className="bg-light"
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Type */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('transfers:fields.type')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={data.type}
                                            onChange={(e) => handleTypeChange(e.target.value)}
                                            isInvalid={!!errors.type}
                                        >
                                            <option value="add">{t('transfers:types.add')}</option>
                                            <option value="transfer">{t('transfers:types.transfer')}</option>
                                            <option value="remove">{t('transfers:types.remove')}</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.type}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Transfer Date */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>
                                            {t('transfers:fields.transferDate')} <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={data.transfer_date}
                                            onChange={(e) => setData('transfer_date', e.target.value)}
                                            isInvalid={!!errors.transfer_date}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.transfer_date}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Status */}
                                <Col md={3} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('transfers:fields.status')}</Form.Label>
                                        <Form.Select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            isInvalid={!!errors.status}
                                        >
                                            <option value="pending">{t('transfers:statuses.pending')}</option>
                                            <option value="in_transit">{t('transfers:statuses.in_transit')}</option>
                                            <option value="completed">{t('transfers:statuses.completed')}</option>
                                            <option value="cancelled">{t('transfers:statuses.cancelled')}</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.status}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* From Store - Show for 'transfer' and 'remove' types */}
                                {(data.type === 'transfer' || data.type === 'remove') && (
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>
                                                {t('transfers:fields.fromStore')} <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Select
                                                value={data.from_store_id}
                                                onChange={(e) => setData('from_store_id', e.target.value)}
                                                isInvalid={!!errors.from_store_id}
                                            >
                                                <option value="">{t('transfers:placeholders.fromStore')}</option>
                                                {stores.map((store) => (
                                                    <option key={store.id} value={store.id} disabled={data.type === 'transfer' && store.id === parseInt(data.to_store_id)}>
                                                        {store.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.from_store_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                )}

                                {/* To Store - Show for 'transfer' and 'add' types */}
                                {(data.type === 'transfer' || data.type === 'add') && (
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>
                                                {t('transfers:fields.toStore')} <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Select
                                                value={data.to_store_id}
                                                onChange={(e) => setData('to_store_id', e.target.value)}
                                                isInvalid={!!errors.to_store_id}
                                            >
                                                <option value="">{t('transfers:placeholders.toStore')}</option>
                                                {stores.map((store) => (
                                                    <option key={store.id} value={store.id} disabled={data.type === 'transfer' && store.id === parseInt(data.from_store_id)}>
                                                        {store.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.to_store_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                )}

                                {/* Observation */}
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>{t('transfers:fields.observation')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={data.observation}
                                            onChange={(e) => setData('observation', e.target.value)}
                                            placeholder={t('transfers:placeholders.observation')}
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
                            <h5 className="mb-0">{t('transfers:items.title')}</h5>
                        </Card.Header>
                        <Card.Body>
                            {/* Add Item Form */}
                            <Row className="mb-3 align-items-end">
                                <Col md={7}>
                                    <Form.Group ref={searchRef} className="position-relative">
                                        <Form.Label>{t('transfers:items.product')}</Form.Label>
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
                                                placeholder={t('transfers:items.searchProduct')}
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
                                                    {t('transfers:items.noProductsFound')}
                                                </ListGroup.Item>
                                            </ListGroup>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>{t('transfers:items.quantity')}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={newItem.quantity}
                                            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="success"
                                        onClick={handleAddItem}
                                        disabled={!newItem.product_id || !newItem.quantity}
                                    >
                                        <IconPlus size={18} className="me-1" />
                                        {t('transfers:items.addItem')}
                                    </Button>
                                </Col>
                            </Row>

                            {errors.items && (
                                <Alert variant="danger" className="mb-3">
                                    {t('transfers:messages.minOneItem')}
                                </Alert>
                            )}

                            {/* Items Table */}
                            <Table bordered hover responsive>
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '50px' }}>#</th>
                                        <th>{t('transfers:items.product')}</th>
                                        <th style={{ width: '150px' }}>{t('transfers:items.quantity')}</th>
                                        <th style={{ width: '80px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-4">
                                                {t('transfers:items.noItems')}
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
