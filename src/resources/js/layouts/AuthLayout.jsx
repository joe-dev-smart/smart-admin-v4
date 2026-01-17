import { Head } from '@inertiajs/react';
import { Container, Row, Col } from 'react-bootstrap';
import { IconPhone, IconWorld, IconMail } from '@tabler/icons-react';
import appConfig from '@/config/app';
import { company as companyLabels } from '@/config/labels';

/**
 * AuthLayout - Reusable layout for authentication pages (Login, Register, etc.)
 * Features a two-column design with branding on the left and form on the right
 */
export default function AuthLayout({ children, title }) {
    const { company, assets, copyright } = appConfig;

    return (
        <>
            <Head title={title} />
            <div className="auth-layout">
                <Container fluid className="min-vh-100">
                    <Row className="min-vh-100">
                        {/* Left Panel - Branding */}
                        <Col lg={6} className="auth-branding d-none d-lg-flex flex-column justify-content-center align-items-center p-5">
                            <div className="auth-branding-content text-center text-white">
                                <h1 className="auth-title mb-4">
                                    {companyLabels.welcomeTitle}
                                </h1>

                                <p className="auth-tagline mb-4">
                                    {companyLabels.tagline}
                                </p>

                                <p className="auth-description mb-5">
                                    {companyLabels.description}
                                </p>

                                <div className="auth-logo mb-5">
                                    <img
                                        src={assets.logo}
                                        alt={company.name}
                                        className="img-fluid"
                                        style={{ maxHeight: '120px' }}
                                    />
                                </div>

                                <div className="auth-contact">
                                    <Row className="justify-content-center g-4">
                                        <Col xs="auto">
                                            <div className="d-flex align-items-center">
                                                <IconPhone size={18} className="me-2 text-primary" />
                                                <span>{company.phone}</span>
                                            </div>
                                        </Col>
                                        <Col xs="auto">
                                            <div className="d-flex align-items-center">
                                                <IconMail size={18} className="me-2 text-primary" />
                                                <span>{company.emails.info}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center mt-3">
                                        <Col xs="auto">
                                            <div className="d-flex align-items-center">
                                                <IconWorld size={18} className="me-2 text-primary" />
                                                <a
                                                    href={company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white text-decoration-none"
                                                >
                                                    {company.website}
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>

                        {/* Right Panel - Form */}
                        <Col lg={6} className="auth-form-panel d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
                            <div className="auth-form-container w-100" style={{ maxWidth: '420px' }}>
                                {/* Mobile Logo */}
                                <div className="d-lg-none text-center mb-4">
                                    <img
                                        src={assets.logo}
                                        alt={company.name}
                                        style={{ maxHeight: '80px' }}
                                    />
                                </div>

                                {children}
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/* Footer */}
                <div className="auth-footer">
                    <span className="text-warning">{companyLabels.copyright}</span>
                    {' - '}
                    <span>{companyLabels.name}</span>
                    <span className="text-danger">®</span>
                    {' '}
                    <span className="text-primary">© {copyright.year}</span>
                </div>
            </div>
        </>
    );
}
