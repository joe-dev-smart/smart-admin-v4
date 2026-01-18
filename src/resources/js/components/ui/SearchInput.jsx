import { Form, InputGroup, Button } from 'react-bootstrap';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable search input with clear button
 */
const SearchInput = ({
    value,
    onChange,
    onClear,
    placeholder,
    className = '',
}) => {
    const { t } = useTranslation();

    return (
        <InputGroup className={className}>
            <InputGroup.Text className="bg-transparent border-end-0">
                <IconSearch size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
                type="text"
                placeholder={placeholder || t('actions.search')}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border-start-0"
            />
            {value && (
                <Button
                    variant="outline-secondary"
                    onClick={onClear}
                    className="border-start-0"
                >
                    <IconX size={18} />
                </Button>
            )}
        </InputGroup>
    );
};

export default SearchInput;
