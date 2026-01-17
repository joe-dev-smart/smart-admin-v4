import { Link } from '@inertiajs/react';
import { Card, Container, Row, Col } from 'react-bootstrap';

export default function GuestLayout({ children }) {
    return (
        <div className="authentication-bg min-vh-100 d-flex align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5} xxl={4}>
                        <Card className="overflow-hidden">
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <Link href="/">
                                        <img
                                            src="/images/logo.svg"
                                            alt="Logo"
                                            height="40"
                                            className="mb-3"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                        <h4 className="text-primary fw-bold">Smart Admin</h4>
                                    </Link>
                                </div>
                                {children}
                            </Card.Body>
                        </Card>
                        <div className="text-center mt-3">
                            <p className="text-muted">
                                &copy; {new Date().getFullYear()} Smart Admin. All rights reserved.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
