import { Head, Link } from '@inertiajs/react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { IconLayoutDashboard, IconLogin, IconUserPlus } from '@tabler/icons-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-vh-100 d-flex align-items-center bg-light">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6}>
                            <Card className="shadow-lg border-0">
                                <Card.Body className="p-5">
                                    <div className="text-center mb-4">
                                        <img
                                            src="/images/logo.png"
                                            alt="Logo"
                                            style={{ height: '60px' }}
                                            className="mb-3"
                                        />
                                        <h1 className="h3 fw-bold text-dark mb-2">
                                            Welcome to Smart Admin
                                        </h1>
                                        <p className="text-muted">
                                            Laravel {laravelVersion} with React & Inertia.js
                                        </p>
                                    </div>

                                    <div className="d-grid gap-3">
                                        {auth.user ? (
                                            <Link href={route('dashboard')}>
                                                <Button variant="primary" size="lg" className="w-100">
                                                    <IconLayoutDashboard size={20} className="me-2" />
                                                    Go to Dashboard
                                                </Button>
                                            </Link>
                                        ) : (
                                            <>
                                                <Link href={route('login')}>
                                                    <Button variant="primary" size="lg" className="w-100">
                                                        <IconLogin size={20} className="me-2" />
                                                        Sign In
                                                    </Button>
                                                </Link>
                                                <Link href={route('register')}>
                                                    <Button variant="outline-primary" size="lg" className="w-100">
                                                        <IconUserPlus size={20} className="me-2" />
                                                        Create Account
                                                    </Button>
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    <div className="text-center mt-4">
                                        <small className="text-muted">
                                            PHP {phpVersion}
                                        </small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}
