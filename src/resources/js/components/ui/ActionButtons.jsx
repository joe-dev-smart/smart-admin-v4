import { Link } from '@inertiajs/react';
import { Button } from 'react-bootstrap';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

/**
 * Shared action buttons for table rows.
 *
 * Standard buttons: View (optional), Edit (optional), Delete (optional).
 * Pass `children` for page-specific extra buttons — inserted between Edit
 * and Delete so the destructive action always stays at the far right.
 *
 * All buttons use native `title` attributes for tooltips (no Popper, no
 * layout shift).
 *
 * @example
 * <ActionButtons
 *   viewRoute={route('users.show', row.id)}
 *   editRoute={route('users.edit', row.id)}
 *   onDelete={() => setDeleteModal({ show: true })}
 * >
 *   <Button title="Force logout" variant="outline-warning" size="sm" className="btn-icon">
 *     <IconLogout size={16} />
 *   </Button>
 * </ActionButtons>
 */
const ActionButtons = ({
    viewRoute   = null,
    editRoute   = null,
    onDelete    = null,

    viewTitle   = null,
    editTitle   = null,
    deleteTitle = null,

    showView   = true,
    showEdit   = true,
    showDelete = true,

    children,
}) => {
    const { t } = useTranslation('common');

    return (
        <div className="d-flex gap-1 flex-wrap">
            {showView && viewRoute && (
                <Link href={viewRoute}>
                    <Button
                        title={viewTitle ?? t('actions.view')}
                        variant="outline-info"
                        size="sm"
                        className="btn-icon"
                    >
                        <IconEye size={16} />
                    </Button>
                </Link>
            )}

            {showEdit && editRoute && (
                <Link href={editRoute}>
                    <Button
                        title={editTitle ?? t('actions.edit')}
                        variant="outline-primary"
                        size="sm"
                        className="btn-icon"
                    >
                        <IconEdit size={16} />
                    </Button>
                </Link>
            )}

            {children}

            {showDelete && onDelete && (
                <Button
                    title={deleteTitle ?? t('actions.delete')}
                    variant="outline-danger"
                    size="sm"
                    className="btn-icon"
                    onClick={onDelete}
                >
                    <IconTrash size={16} />
                </Button>
            )}
        </div>
    );
};

export default ActionButtons;
