import { useForm, Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { IconLanguage, IconDeviceFloppy } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui';

const LOCALES = [
    { value: 'es', label: 'Español', flag: '🇧🇴' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
];

export default function SettingsIndex({ settings }) {
    const { t } = useTranslation(['common']);
    const { flash } = usePage().props;

    const { data, setData, put, processing } = useForm({
        default_locale: settings.default_locale ?? 'es',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Apply the change immediately in this session
        i18n.changeLanguage(data.default_locale);
        localStorage.setItem('i18nextLng', data.default_locale);

        put(route('settings.update'));
    };

    return (
        <MainLayout>
            <Head title={t('nav.settings', 'System Settings')} />

            <PageHeader
                title={t('nav.settings', 'System Settings')}
                subtitle={t('settings.subtitle', 'Configure global application preferences')}
                breadcrumbs={[{ label: t('nav.settings', 'System Settings') }]}
            />

            {flash?.success && (
                <div className="alert alert-success alert-dismissible mb-3">
                    {t('settings.messages.updated', 'Settings saved successfully')}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" />
                </div>
            )}

            <Row>
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <div className="d-flex align-items-center gap-2">
                                <IconLanguage size={20} className="text-primary" />
                                <h6 className="mb-0">{t('settings.language.title', 'Language')}</h6>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted small mb-3">
                                {t('settings.language.description', 'Default language for new sessions. Users who have already selected a language will keep their preference.')}
                            </p>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label>{t('settings.language.defaultLanguage', 'Default Language')}</Form.Label>
                                    <div className="d-flex gap-3">
                                        {LOCALES.map(locale => (
                                            <Form.Check
                                                key={locale.value}
                                                type="radio"
                                                id={`locale-${locale.value}`}
                                                name="default_locale"
                                                label={`${locale.flag} ${locale.label}`}
                                                value={locale.value}
                                                checked={data.default_locale === locale.value}
                                                onChange={e => setData('default_locale', e.target.value)}
                                                className="fs-5"
                                            />
                                        ))}
                                    </div>
                                </Form.Group>

                                <Button type="submit" variant="primary" disabled={processing}>
                                    <IconDeviceFloppy size={16} className="me-2" />
                                    {processing ? t('actions.saving') : t('actions.save')}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
}
