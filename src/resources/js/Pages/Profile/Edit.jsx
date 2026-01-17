import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Card, Col, Row } from 'react-bootstrap';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <MainLayout>
            <Head title="Profile" />

            <div className="container-fluid">
                {/* Page Title */}
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box">
                            <h4 className="page-title">Profile Settings</h4>
                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item">
                                        <a href="#">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active">Profile</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <Row>
                    <Col lg={12}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="card-title mb-0">Profile Information</h5>
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
                                <h5 className="card-title mb-0">Update Password</h5>
                            </Card.Header>
                            <Card.Body>
                                <UpdatePasswordForm />
                            </Card.Body>
                        </Card>

                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="card-title mb-0 text-danger">Delete Account</h5>
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
