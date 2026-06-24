import { useState } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Badge } from 'react-bootstrap';
import { IconBan } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import {
    PageHeader,
    DataTable,
    ActionButtons,
    ConfirmModal,
} from '@/components/ui';

const statusColors = { valid: 'success', annulled: 'danger', draft: 'warning' };
const paymentColors = {
    cash: 'primary', bank_deposit: 'info', card: 'secondary',
    qr_payment: 'dark', check: 'warning', payment_plan: 'danger',
};
const formatCurrency = (val) => parseFloat(val ?? 0).toFixed(2);

export default function SalesIndex({ sales, stores, filters }) {
    const { t } = useTranslation(['sales', 'common']);
    const { flash } = usePage().props;
    const [annulModal, setAnnulModal] = useState({ show: false, sale: null });
    const [annulling, setAnnulling] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, sale: null });
    const [deleting, setDeleting] = useState(false);

    const columns = [
        {
            key: 'code',
            label: t('sales:fields.code'),
            sortable: true,
            render: (row) => (
                <Link href={route('sales.show', row.id)} className="fw-medium text-decoration-none">
                    {row.code}
                </Link>
            ),
        },
        {
            key: 'sale_date',
            label: t('sales:fields.saleDate'),
            sortable: true,
            render: (row) => row.sale_date?.split('T')[0] ?? '-',
        },
        {
            key: 'client',
            label: t('sales:fields.client'),
            sortable: false,
            render: (row) => row.client?.name ?? '-',
        },
        {
            key: 'store',
            label: t('sales:fields.store'),
            sortable: false,
            render: (row) => row.store?.name ?? '-',
        },
        {
            key: 'total',
            label: t('sales:fields.total'),
            sortable: false,
            render: (row) => (
                <span className="fw-medium">
                    {formatCurrency((row.subtotal ?? 0) - (row.discount ?? 0))}
                </span>
            ),
        },
        {
            key: 'payment',
            label: t('sales:fields.payment'),
            sortable: true,
            render: (row) => (
                <Badge bg={paymentColors[row.payment] ?? 'secondary'} className="text-white">
                    {t(`sales:payments.${row.payment}`)}
                </Badge>
            ),
        },
        {
            key: 'status',
            label: t('sales:fields.status'),
            sortable: true,
            render: (row) => (
                <Badge bg={statusColors[row.status] ?? 'secondary'}>
                    {t(`sales:statuses.${row.status}`)}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: t('common:table.actions'),
            sortable: false,
            render: (row) => (
                <ActionButtons
                    viewRoute={route('sales.show', row.id)}
                    editRoute={row.status === 'draft' ? route('sales.edit', row.id) : null}
                    onDelete={row.status !== 'valid'
                        ? () => setDeleteModal({ show: true, sale: row })
                        : null}
                >
                    {row.status === 'valid' && (
                        <Button
                            title={t('sales:actions.annul')}
                            variant="outline-warning"
                            size="sm"
                            className="btn-icon"
                            onClick={() => setAnnulModal({ show: true, sale: row })}
                        >
                            <IconBan size={16} />
                        </Button>
                    )}
                </ActionButtons>
            ),
        },
    ];

    const handleAnnul = () => {
        setAnnulling(true);
        router.patch(route('sales.annul', annulModal.sale.id), {}, {
            onSuccess: () => setAnnulModal({ show: false, sale: null }),
            onFinish: () => setAnnulling(false),
        });
    };

    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('sales.destroy', deleteModal.sale.id), {
            onSuccess: () => setDeleteModal({ show: false, sale: null }),
            onFinish: () => setDeleting(false),
        });
    };

    const handleFilter = (key, value) => {
        router.get(route('sales.index'), { ...filters, [key]: value, page: 1 }, { preserveState: true });
    };

    return (
        <MainLayout>
            <Head title={t('sales:title')} />

            <PageHeader
                title={t('sales:title')}
                subtitle={t('sales:subtitle')}
                breadcrumbs={[{ label: t('sales:title') }]}
                actions={
                    <Link href={route('sales.create')}>
                        <Button variant="primary">{t('sales:newSale')}</Button>
                    </Link>
                }
            />

            {flash?.success && (
                <div className="alert alert-success alert-dismissible mb-3">
                    {t(flash.success)}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" />
                </div>
            )}
            {flash?.error && (
                <div className="alert alert-danger alert-dismissible mb-3">
                    {t(flash.error)}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" />
                </div>
            )}

            <DataTable
                columns={columns}
                data={sales.data}
                pagination={sales}
                filters={filters}
                routeName="sales.index"
            >
                <Form.Select size="sm" style={{ width: 180 }} value={filters.store_id ?? 'all'}
                    onChange={e => handleFilter('store_id', e.target.value)}>
                    <option value="all">{t('sales:filters.allStores')}</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Form.Select>
                <Form.Select size="sm" style={{ width: 140 }} value={filters.status ?? 'all'}
                    onChange={e => handleFilter('status', e.target.value)}>
                    <option value="all">{t('common:status.all')}</option>
                    {['valid', 'annulled', 'draft'].map(s => (
                        <option key={s} value={s}>{t(`sales:statuses.${s}`)}</option>
                    ))}
                </Form.Select>
                <Form.Select size="sm" style={{ width: 160 }} value={filters.payment ?? 'all'}
                    onChange={e => handleFilter('payment', e.target.value)}>
                    <option value="all">{t('sales:filters.allPayments')}</option>
                    {['cash', 'bank_deposit', 'card', 'qr_payment', 'check', 'payment_plan'].map(p => (
                        <option key={p} value={p}>{t(`sales:payments.${p}`)}</option>
                    ))}
                </Form.Select>
            </DataTable>

            <ConfirmModal
                show={annulModal.show}
                title={t('sales:annul.confirmTitle')}
                message={t('sales:annul.confirmMessage', { code: annulModal.sale?.code })}
                confirmLabel={t('sales:actions.annul')}
                confirmVariant="warning"
                loading={annulling}
                onConfirm={handleAnnul}
                onCancel={() => setAnnulModal({ show: false, sale: null })}
            />

            <ConfirmModal
                show={deleteModal.show}
                title={t('common:messages.confirmDeleteTitle')}
                message={t('sales:messages.confirmDelete', { code: deleteModal.sale?.code })}
                confirmLabel={t('common:actions.delete')}
                confirmVariant="danger"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ show: false, sale: null })}
            />
        </MainLayout>
    );
}
