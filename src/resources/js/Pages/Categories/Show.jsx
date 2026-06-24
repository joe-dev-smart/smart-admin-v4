import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Button, ListGroup, Badge } from 'react-bootstrap';
import { IconCategory, IconEdit, IconArrowLeft, IconChevronRight } from '@tabler/icons-react';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader, StatusBadge } from '@/components/ui';

export default function CategoriesShow({ category }) {
    const { t } = useTranslation(['categories', 'common']);

    return (
        <MainLayout>
            <Head title={category.name} />

            <PageHeader
                title={category.name}
                subtitle={t('categories:edit.subtitle')}
                breadcrumbs={[
                    { label: t('categories:title'), href: route('categories.index') },
                    { label: category.name },
                ]}
                actions={
                    <div className="d-flex gap-2">
                        <Link href={route('categories.index')}>
                            <Button variant="outline-secondary" size="sm">
                                <IconArrowLeft size={16} className="me-1" />
                                {t('common:actions.back')}
                            </Button>
                        </Link>
                        <Link href={route('categories.edit', category.id)}>
                            <Button variant="primary" size="sm">
                                <IconEdit size={16} className="me-1" />
                                {t('common:actions.edit')}
                            </Button>
                        </Link>
                    </div>
                }
            />

            <Row>
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <div className="d-flex align-items-center gap-2">
                                <IconCategory size={20} className="text-primary" />
                                <h6 className="mb-0">{t('categories:title')}</h6>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('categories:fields.name')}</p>
                                    <p className="fw-medium mb-0">{category.name}</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="text-muted small mb-1">{t('categories:fields.status')}</p>
                                    <StatusBadge status={category.status} />
                                </Col>
                                {category.parent && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('categories:fields.parent')}</p>
                                        <Link href={route('categories.show', category.parent.id)}
                                            className="d-flex align-items-center gap-1 text-primary">
                                            <IconChevronRight size={14} />
                                            {category.parent.name}
                                        </Link>
                                    </Col>
                                )}
                                {category.description && (
                                    <Col sm={12}>
                                        <p className="text-muted small mb-1">{t('categories:fields.description')}</p>
                                        <p className="mb-0">{category.description}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>

                    {category.children?.length > 0 && (
                        <Card className="shadow-sm mt-3">
                            <Card.Header className="bg-white">
                                <h6 className="mb-0">{t('categories:fields.children')} <Badge bg="secondary">{category.children.length}</Badge></h6>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {category.children.map(child => (
                                    <ListGroup.Item key={child.id} className="d-flex justify-content-between align-items-center">
                                        <Link href={route('categories.show', child.id)} className="text-decoration-none">
                                            {child.name}
                                        </Link>
                                        <StatusBadge status={child.status} />
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    )}
                </Col>
            </Row>
        </MainLayout>
    );
}
