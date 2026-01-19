import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Col, Row } from 'react-bootstrap';
import { PageHeader } from '@/components/ui';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { t } = useTranslation(['profile', 'common']);

    return (
        <MainLayout>
            <Head title={t('profile:title')} />

            <div className="container-fluid">
                <PageHeader
                    title={t('profile:title')}
                    subtitle={t('profile:subtitle')}
                    breadcrumbs={[
                        { label: t('common:nav.dashboard'), href: route('dashboard') },
                        { label: t('profile:title') },
                    ]}
                />

                <Row>
                    <Col lg={12}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="card-title mb-0">{t('profile:sections.personalInfo')}</h5>
                            </Card.Header>
                            <Card.Body>
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </Card.Body>
                        </Card>

                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="card-title mb-0">{t('profile:sections.updatePassword')}</h5>
                            </Card.Header>
                            <Card.Body>
                                <UpdatePasswordForm />
                            </Card.Body>
                        </Card>

                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="card-title mb-0 text-danger">{t('profile:sections.deleteAccount')}</h5>
                            </Card.Header>
                            <Card.Body>
                                <DeleteUserForm />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
}
