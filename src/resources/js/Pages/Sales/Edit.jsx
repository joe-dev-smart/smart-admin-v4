import { useState, useRef, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Row, Col, Button, Table, Alert } from 'react-bootstrap';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

const formatCurrency = (val) => parseFloat(val ?? 0).toFixed(2);

export default function SalesEdit({ sale, stores, clients, products }) {
    const { t } = useTranslation(['sales', 'common']);

    const { data, setData, put, processing, errors } = useForm({
        store_id: String(sale.store_id ?? ''),
        client_id: String(sale.client_id ?? ''),
        sale_date: sale.sale_date?.split('T')[0] ?? '',
        payment: sale.payment ?? 'cash',
        paid: String(sale.paid ?? '0'),
        discount: String(sale.discount ?? '0'),
        observation: sale.observation ?? '',
        status: sale.status ?? 'valid',
        items: (sale.items ?? []).map(i => ({
            product_id: i.product_id,
            product_name: i.product_name ?? i.product?.name ?? '',
            product_code: i.product?.code ?? '',
            quantity: i.quantity,
            sale_price: String(i.sale_price),
            detail: i.detail ?? '',
        })),
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [newItem, setNewItem] = useState({ product_id: '', product_name: '', product_code: '', quantity: 1, sale_price: '', detail: '' });
    const searchRef = useRef(null);

    const filteredProducts = products.filter(p => {
        const term = searchTerm.toLowerCase();
        return p.code?.toLowerCase().includes(term) || p.name?.toLowerCase().includes(term);
    }).slice(0, 10);

    useEffect(() => {
        const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const subtotal = data.items.reduce((s, i) => s + i.quantity * parseFloat(i.sale_price || 0), 0);
    const discount = parseFloat(data.discount) || 0;
    const total = subtotal - discount;

    const handleSelectProduct = (product) => {
        setNewItem({ product_id: product.id, product_name: product.name, product_code: product.code, quantity: 1, sale_price: product.sale_price_1 ?? '', detail: '' });
        setSearchTerm(`${product.code} - ${product.name}`);
        setShowResults(false);
    };

    const handleAddItem = () => {
        if (!newItem.product_id || !newItem.quantity || !newItem.sale_price) return;
        const existing = data.items.findIndex(i => i.product_id === newItem.product_id);
        if (existing >= 0) {
            const updated = [...data.items];
            updated[existing].quantity += parseInt(newItem.quantity);
            setData('items', updated);
        } else {
            setData('items', [...data.items, { ...newItem, quantity: parseInt(newItem.quantity) }]);
        }
        setNewItem({ product_id: '', product_name: '', product_code: '', quantity: 1, sale_price: '', detail: '' });
        setSearchTerm('');
    };

    const handleRemoveItem = (idx) => setData('items', data.items.filter((_, i) => i !== idx));

    const handleUpdateItem = (idx, field, value) => {
        const updated = [...data.items];
        updated[idx][field] = value;
        setData('items', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('sales.update', sale.id));
    };

    return (
        <MainLayout>
            <Head title={t('sales:editSale')} />
            <PageHeader
                title={t('sales:editSale')}
                subtitle={sale.code}
                breadcrumbs={[{ label: t('sales:title'), href: route('sales.index') }, { label: sale.code, href: route('sales.show', sale.id) }, { label: t('common:actions.edit') }]}
            />

            <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                    <Col md={8}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white"><h6 className="mb-0">{t('sales:sections.generalInfo')}</h6></Card.Header>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label>{t('sales:fields.store')} <span className="text-danger">*</span></Form.Label>
                                            <Form.Select value={data.store_id} onChange={e => setData('store_id', e.target.value)} isInvalid={!!errors.store_id}>
                                                <option value="">{t('sales:placeholders.store')}</option>
                                                {stores.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">{errors.store_id}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label>{t('sales:fields.client')} <span className="text-danger">*</span></Form.Label>
                                            <Form.Select value={data.client_id} onChange={e => setData('client_id', e.target.value)} isInvalid={!!errors.client_id}>
                                                <option value="">{t('sales:placeholders.client')}</option>
                                                {clients.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">{errors.client_id}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label>{t('sales:fields.saleDate')} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="date" value={data.sale_date} onChange={e => setData('sale_date', e.target.value)} isInvalid={!!errors.sale_date} />
                                            <Form.Control.Feedback type="invalid">{errors.sale_date}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label>{t('sales:fields.status')}</Form.Label>
                                            <Form.Select value={data.status} onChange={e => setData('status', e.target.value)}>
                                                {['valid', 'draft'].map(s => <option key={s} value={s}>{t(`sales:statuses.${s}`)}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12}>
                                        <Form.Group>
                                            <Form.Label>{t('sales:fields.observation')}</Form.Label>
                                            <Form.Control as="textarea" rows={2} value={data.observation} onChange={e => setData('observation', e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="shadow-sm mt-3">
                            <Card.Header className="bg-white"><h6 className="mb-0">{t('sales:sections.items')}</h6></Card.Header>
                            <Card.Body>
                                {errors.items && <Alert variant="danger">{errors.items}</Alert>}
                                <div ref={searchRef} className="position-relative mb-3">
                                    <Form.Control size="sm" placeholder={t('sales:items.searchProduct')} value={searchTerm}
                                        onChange={e => { setSearchTerm(e.target.value); setShowResults(true); }} onFocus={() => setShowResults(true)} />
                                    {showResults && filteredProducts.length > 0 && (
                                        <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ top: '100%', zIndex: 9, maxHeight: 220, overflowY: 'auto' }}>
                                            {filteredProducts.map(p => (
                                                <div key={p.id} className="px-3 py-2" style={{ cursor: 'pointer' }} onClick={() => handleSelectProduct(p)}
                                                    onMouseEnter={e => e.currentTarget.classList.add('bg-light')}
                                                    onMouseLeave={e => e.currentTarget.classList.remove('bg-light')}>
                                                    <div className="fw-medium small">{p.name}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{p.code}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {newItem.product_id && (
                                    <Row className="g-2 mb-3 align-items-end">
                                        <Col sm={3}><Form.Control size="sm" type="number" min={1} value={newItem.quantity} onChange={e => setNewItem(p => ({ ...p, quantity: +e.target.value }))} /></Col>
                                        <Col sm={3}><Form.Control size="sm" type="number" step="0.01" min={0} value={newItem.sale_price} onChange={e => setNewItem(p => ({ ...p, sale_price: e.target.value }))} /></Col>
                                        <Col sm={4}><Form.Control size="sm" value={newItem.detail} onChange={e => setNewItem(p => ({ ...p, detail: e.target.value }))} /></Col>
                                        <Col sm={2}><Button size="sm" variant="success" onClick={handleAddItem} className="w-100"><IconPlus size={14} /></Button></Col>
                                    </Row>
                                )}

                                {data.items.length > 0 ? (
                                    <Table size="sm" responsive>
                                        <thead className="table-light">
                                            <tr>
                                                <th>{t('sales:items.product')}</th>
                                                <th style={{ width: 80 }}>{t('sales:items.quantity')}</th>
                                                <th style={{ width: 100 }}>{t('sales:items.price')}</th>
                                                <th className="text-end" style={{ width: 100 }}>{t('sales:items.subtotal')}</th>
                                                <th style={{ width: 40 }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td><div className="fw-medium small">{item.product_name}</div><div className="text-muted" style={{ fontSize: '0.7rem' }}>{item.product_code}</div></td>
                                                    <td><Form.Control size="sm" type="number" min={1} value={item.quantity} onChange={e => handleUpdateItem(idx, 'quantity', +e.target.value)} style={{ width: 70 }} /></td>
                                                    <td><Form.Control size="sm" type="number" step="0.01" min={0} value={item.sale_price} onChange={e => handleUpdateItem(idx, 'sale_price', e.target.value)} style={{ width: 90 }} /></td>
                                                    <td className="text-end">{formatCurrency(item.quantity * parseFloat(item.sale_price || 0))}</td>
                                                    <td><Button size="sm" variant="outline-danger" onClick={() => handleRemoveItem(idx)}><IconTrash size={14} /></Button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p className="text-muted text-center py-3 small">{t('sales:items.noItems')}</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white"><h6 className="mb-0">{t('sales:sections.payment')}</h6></Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('sales:fields.payment')}</Form.Label>
                                    <Form.Select value={data.payment} onChange={e => setData('payment', e.target.value)}>
                                        {['cash','bank_deposit','card','qr_payment','check','payment_plan'].map(p => (
                                            <option key={p} value={p}>{t(`sales:payments.${p}`)}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('sales:fields.discount')}</Form.Label>
                                    <Form.Control type="number" step="0.01" min={0} value={data.discount} onChange={e => setData('discount', e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('sales:fields.paid')}</Form.Label>
                                    <Form.Control type="number" step="0.01" min={0} value={data.paid} onChange={e => setData('paid', e.target.value)} />
                                </Form.Group>
                                <hr />
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted small">{t('sales:fields.subtotal')}</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted small">{t('sales:fields.discount')}</span>
                                    <span className="text-danger">-{formatCurrency(discount)}</span>
                                </div>
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>{t('sales:fields.total')}</span>
                                    <span className="text-primary">{formatCurrency(total)}</span>
                                </div>
                            </Card.Body>
                        </Card>
                        <div className="d-flex gap-2 mt-3">
                            <Button variant="outline-secondary" className="flex-fill" onClick={() => window.history.back()} disabled={processing}>
                                {t('common:actions.cancel')}
                            </Button>
                            <Button type="submit" variant="primary" className="flex-fill" disabled={processing || data.items.length === 0}>
                                {processing ? t('common:actions.saving') : t('common:actions.save')}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </MainLayout>
    );
}
