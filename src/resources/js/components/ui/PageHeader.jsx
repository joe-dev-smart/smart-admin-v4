import { Link } from '@inertiajs/react';
import { Button } from 'react-bootstrap';
import { IconPlus, IconArrowLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable page header component with breadcrumb and action buttons
 */
const PageHeader = ({
    title,
    subtitle,
    breadcrumbs = [],
    createRoute,
    createLabel,
    backRoute,
    children,
}) => {
    const { t } = useTranslation();

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                    <div>
                        <h4 className="page-title mb-1">{title}</h4>
                        {subtitle && (
                            <p className="text-muted mb-0">{subtitle}</p>
                        )}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        {backRoute && (
                            <Link href={backRoute}>
                                <Button variant="outline-secondary">
                                    <IconArrowLeft size={18} className="me-1" />
                                    {t('actions.back')}
                                </Button>
                            </Link>
                        )}
                        {createRoute && (
                            <Link href={createRoute}>
                                <Button variant="primary">
                                    <IconPlus size={18} className="me-1" />
                                    {createLabel || t('actions.create')}
                                </Button>
                            </Link>
                        )}
                        {children}
                    </div>
                </div>
                {breadcrumbs.length > 0 && (
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            {breadcrumbs.map((crumb, index) => (
                                <li
                                    key={index}
                                    className={`breadcrumb-item ${
                                        index === breadcrumbs.length - 1
                                            ? 'active'
                                            : ''
                                    }`}
                                >
                                    {crumb.href ? (
                                        <Link href={crumb.href}>{crumb.label}</Link>
                                    ) : (
                                        crumb.label
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
