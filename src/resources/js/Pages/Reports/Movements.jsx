import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Badge } from 'react-bootstrap';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, DataTable } from '@/components/ui';

const typeColors = {
    entry: 'success', entry_transfer: 'info', sale_return: 'warning',
    remove: 'danger', out_transfer: 'secondary', sale: 'primary',
};

export default function ReportsMovements({ movements, stores, filters }) {
    const { t } = useTranslation(['reports', 'common']);

    const columns = [
        {
            key: 'created_at',
            label: t('reports:movements.date'),
            sortable: false,
            render: (row) => row.created_at?.split('T')[0] ?? '-',
        },
        {
            key: 'product',
            label: t('reports:movements.product'),
            sortable: false,
            render: (row) => (
                <div>
                    <div className="fw-medium">{row.product?.name}</div>
                    <div className="text-muted small">{row.product?.code}</div>
                </div>
            ),
        },
        {
            key: 'store',
            label: t('reports:movements.store'),
            sortable: false,
            render: (row) => row.store?.name ?? '-',
        },
        {
            key: 'type',
            label: t('reports:movements.type'),
            sortable: false,
            render: (row) => (
                <Badge bg={typeColors[row.type] ?? 'secondary'}>
                    {t(`reports:movements.types.${row.type}`)}
                </Badge>
            ),
        },
        {
            key: 'quantity',
            label: t('reports:movements.quantity'),
            sortable: false,
            render: (row) => {
                const isOut = ['sale', 'out_transfer', 'remove'].includes(row.type);
                return (
                    <span className={isOut ? 'text-danger fw-medium' : 'text-success fw-medium'}>
                        {isOut ? '-' : '+'}{row.quantity}
                    </span>
                );
            },
        },
        {
            key: 'user',
            label: t('reports:movements.user'),
            sortable: false,
            render: (row) => row.user?.name ?? '-',
        },
        {
            key: 'description',
            label: t('reports:movements.description'),
            sortable: false,
            render: (row) => <span className="text-muted small">{row.system_description ?? '-'}</span>,
        },
    ];

    const handleFilter = (key, value) => {
        router.get(route('reports.movements'), { ...filters, [key]: value, page: 1 }, { preserveState: true });
    };

    const movementTypes = ['entry', 'entry_transfer', 'sale_return', 'remove', 'out_transfer', 'sale'];

    return (
        <MainLayout>
            <Head title={t('reports:movements.title')} />
            <PageHeader
                title={t('reports:movements.title')}
                subtitle={t('reports:movements.description')}
                breadcrumbs={[
                    { label: t('reports:title'), href: route('reports.index') },
                    { label: t('reports:movements.title') },
                ]}
            />

            <DataTable
                columns={columns}
                data={movements.data}
                pagination={movements}
                filters={filters}
                routeName="reports.movements"
            >
                <Form.Select size="sm" style={{ width: 180 }} value={filters.store_id ?? 'all'}
                    onChange={e => handleFilter('store_id', e.target.value)}>
                    <option value="all">{t('reports:filters.allStores')}</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Form.Select>
                <Form.Select size="sm" style={{ width: 160 }} value={filters.type ?? 'all'}
                    onChange={e => handleFilter('type', e.target.value)}>
                    <option value="all">{t('reports:filters.allTypes')}</option>
                    {movementTypes.map(mt => (
                        <option key={mt} value={mt}>{t(`reports:movements.types.${mt}`)}</option>
                    ))}
                </Form.Select>
                <Form.Control size="sm" type="date" style={{ width: 150 }} value={filters.date_from ?? ''}
                    onChange={e => handleFilter('date_from', e.target.value)} />
                <Form.Control size="sm" type="date" style={{ width: 150 }} value={filters.date_to ?? ''}
                    onChange={e => handleFilter('date_to', e.target.value)} />
            </DataTable>
        </MainLayout>
    );
}
