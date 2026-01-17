import MainLayout from '@/layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Card, Col, Row } from 'react-bootstrap';
import { IconUsers, IconShoppingCart, IconCurrencyDollar, IconChartBar } from '@tabler/icons-react';

export default function Dashboard() {
    const { auth } = usePage().props;

    const stats = [
        { title: 'Total Users', value: '1,234', icon: IconUsers, color: 'primary' },
        { title: 'Orders', value: '567', icon: IconShoppingCart, color: 'success' },
        { title: 'Revenue', value: '$12,345', icon: IconCurrencyDollar, color: 'info' },
        { title: 'Growth', value: '+15%', icon: IconChartBar, color: 'warning' },
    ];

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <div className="container-fluid">
                {/* Page Title */}
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box">
                            <h4 className="page-title">Dashboard</h4>
                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item">
                                        <a href="#">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active">Dashboard</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Welcome Card */}
                <Row className="mb-4">
                    <Col xs={12}>
                        <Card>
                            <Card.Body>
                                <h5 className="card-title mb-1">
                                    Welcome back, {auth?.user?.name || 'User'}!
                                </h5>
                                <p className="text-muted mb-0">
                                    Here's what's happening with your projects today.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Stats Cards */}
                <Row>
                    {stats.map((stat, index) => (
                        <Col key={index} xl={3} md={6} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <div className="d-flex align-items-center">
                                        <div className={`avatar-sm bg-${stat.color} bg-opacity-10 rounded`}>
                                            <span className={`avatar-title text-${stat.color}`}>
                                                <stat.icon size={24} />
                                            </span>
                                        </div>
                                        <div className="ms-3">
                                            <h5 className="mb-0">{stat.value}</h5>
                                            <p className="text-muted mb-0">{stat.title}</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Content Area */}
                <Row>
                    <Col lg={8}>
                        <Card>
                            <Card.Header>
                                <h5 className="card-title mb-0">Recent Activity</h5>
                            </Card.Header>
                            <Card.Body>
                                <p className="text-muted">
                                    Your recent activity will appear here. Start by exploring
                                    the admin panel features.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card>
                            <Card.Header>
                                <h5 className="card-title mb-0">Quick Actions</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary">
                                        Create New Project
                                    </button>
                                    <button className="btn btn-outline-secondary">
                                        View Reports
                                    </button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
}
