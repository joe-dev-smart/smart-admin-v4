import { Table, Card, Form, Button, Pagination } from 'react-bootstrap';
import { Link, router } from '@inertiajs/react';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import SearchInput from './SearchInput';

/**
 * Reusable data table component with sorting, pagination, and search
 */
const DataTable = ({
    columns,
    data,
    pagination,
    filters,
    routeName,
    searchable = true,
    children,
}) => {
    const { t } = useTranslation();

    // Handle search
    const handleSearch = (value) => {
        router.get(
            route(routeName),
            { ...filters, search: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Handle clear search
    const handleClearSearch = () => {
        router.get(
            route(routeName),
            { ...filters, search: '', page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Handle sort
    const handleSort = (field) => {
        const direction =
            filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get(
            route(routeName),
            { ...filters, sort: field, direction, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Handle per page change
    const handlePerPageChange = (value) => {
        router.get(
            route(routeName),
            { ...filters, per_page: value, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Handle page change
    const handlePageChange = (page) => {
        router.get(
            route(routeName),
            { ...filters, page },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Get sort icon
    const getSortIcon = (field) => {
        if (filters.sort !== field) {
            return <IconSelector size={16} className="ms-1 text-muted" />;
        }
        return filters.direction === 'asc' ? (
            <IconChevronUp size={16} className="ms-1" />
        ) : (
            <IconChevronDown size={16} className="ms-1" />
        );
    };

    return (
        <Card>
            <Card.Body>
                {/* Toolbar */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                    {searchable && (
                        <div style={{ minWidth: '300px' }}>
                            <SearchInput
                                value={filters.search || ''}
                                onChange={handleSearch}
                                onClear={handleClearSearch}
                            />
                        </div>
                    )}
                    <div className="d-flex align-items-center gap-2">
                        {children}
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <Table hover className="mb-0">
                        <thead className="table-light">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={column.sortable ? 'cursor-pointer user-select-none' : ''}
                                        onClick={
                                            column.sortable
                                                ? () => handleSort(column.key)
                                                : undefined
                                        }
                                        style={column.width ? { width: column.width } : {}}
                                    >
                                        <span className="d-flex align-items-center">
                                            {column.label}
                                            {column.sortable && getSortIcon(column.key)}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="text-center text-muted py-4"
                                    >
                                        {t('table.noData')}
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, rowIndex) => (
                                    <tr key={row.id || rowIndex}>
                                        {columns.map((column) => (
                                            <td key={column.key}>
                                                {column.render
                                                    ? column.render(row)
                                                    : row[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-muted">
                                {t('table.showing')} {pagination.from}-{pagination.to}{' '}
                                {t('table.of')} {pagination.total} {t('table.entries')}
                            </span>
                            <Form.Select
                                size="sm"
                                value={filters.per_page || 10}
                                onChange={(e) => handlePerPageChange(e.target.value)}
                                style={{ width: 'auto' }}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </Form.Select>
                        </div>
                        <Pagination className="mb-0">
                            <Pagination.First
                                disabled={pagination.current_page === 1}
                                onClick={() => handlePageChange(1)}
                            />
                            <Pagination.Prev
                                disabled={pagination.current_page === 1}
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                            />
                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                let page;
                                if (pagination.last_page <= 5) {
                                    page = i + 1;
                                } else if (pagination.current_page <= 3) {
                                    page = i + 1;
                                } else if (pagination.current_page >= pagination.last_page - 2) {
                                    page = pagination.last_page - 4 + i;
                                } else {
                                    page = pagination.current_page - 2 + i;
                                }
                                return (
                                    <Pagination.Item
                                        key={page}
                                        active={page === pagination.current_page}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </Pagination.Item>
                                );
                            })}
                            <Pagination.Next
                                disabled={pagination.current_page === pagination.last_page}
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                            />
                            <Pagination.Last
                                disabled={pagination.current_page === pagination.last_page}
                                onClick={() => handlePageChange(pagination.last_page)}
                            />
                        </Pagination>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default DataTable;
