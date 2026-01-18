import { Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * Reusable status badge component
 * @param {string} status - 'enabled' or 'disabled'
 * @param {string} enabledVariant - Bootstrap variant for enabled state
 * @param {string} disabledVariant - Bootstrap variant for disabled state
 */
const StatusBadge = ({
    status,
    enabledVariant = 'success',
    disabledVariant = 'secondary',
    className = '',
}) => {
    const { t } = useTranslation();

    const isEnabled = status === 'enabled';
    const variant = isEnabled ? enabledVariant : disabledVariant;
    const label = isEnabled ? t('status.enabled') : t('status.disabled');

    return (
        <Badge
            bg={`${variant}-subtle`}
            text={variant}
            className={`fw-medium ${className}`}
        >
            {label}
        </Badge>
    );
};

export default StatusBadge;
