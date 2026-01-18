import { Link } from '@inertiajs/react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';

/**
 * Reusable action buttons for table rows
 */
const ActionButtons = ({
    editRoute,
    viewRoute,
    onDelete,
    showView = false,
    showEdit = true,
    showDelete = true,
}) => {
    return (
        <ButtonGroup size="sm">
            {showView && viewRoute && (
                <Link href={viewRoute}>
                    <Button variant="outline-info" size="sm" className="btn-icon">
                        <IconEye size={16} />
                    </Button>
                </Link>
            )}
            {showEdit && editRoute && (
                <Link href={editRoute}>
                    <Button variant="outline-primary" size="sm" className="btn-icon">
                        <IconEdit size={16} />
                    </Button>
                </Link>
            )}
            {showDelete && onDelete && (
                <Button
                    variant="outline-danger"
                    size="sm"
                    className="btn-icon"
                    onClick={onDelete}
                >
                    <IconTrash size={16} />
                </Button>
            )}
        </ButtonGroup>
    );
};

export default ActionButtons;
