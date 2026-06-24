import { userDropdownItems } from '@/layouts/components/data';
import { Link, usePage } from '@inertiajs/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { TbSettings } from 'react-icons/tb';
import { Image } from 'react-bootstrap';

const usersPath = '/images/users';

const UserProfile = () => {
    const { auth } = usePage().props;
    const { t } = useTranslation('common');
    const user = auth?.user;
    const isSuperAdmin = user?.is_super_admin ?? false;

    const visibleItems = userDropdownItems.filter(
        item => !item.superAdminOnly || isSuperAdmin
    );

    return (
        <div className="sidenav-user">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <Link href="/profile" className="link-reset">
                        <Image
                            src={`${usersPath}/user-2.jpg`}
                            alt="user-image"
                            width="36"
                            height="36"
                            className="rounded-circle mb-2 avatar-md"
                        />
                        <span className="sidenav-user-name fw-bold">{user?.name || 'Usuario'}</span>
                        <span className="fs-12 fw-semibold" data-lang="user-role">
                            {user?.username || 'Admin'}
                        </span>
                    </Link>
                </div>
                <Dropdown>
                    <DropdownToggle
                        as={'a'}
                        role="button"
                        aria-label="profile dropdown"
                        className="dropdown-toggle drop-arrow-none link-reset sidenav-user-set-icon"
                    >
                        <TbSettings className="fs-24 align-middle ms-1" />
                    </DropdownToggle>

                    <DropdownMenu>
                        {visibleItems.map((item, idx) => (
                            <Fragment key={idx}>
                                {item.isHeader ? (
                                    <div className="dropdown-header noti-title">
                                        <h6 className="text-overflow m-0">{t(item.label, item.label)}</h6>
                                    </div>
                                ) : item.isDivider ? (
                                    <DropdownDivider />
                                ) : (
                                    <DropdownItem
                                        as={Link}
                                        href={item.url ?? ''}
                                        method={item.method || 'get'}
                                        className={item.class}
                                    >
                                        {item.icon && <item.icon className="me-2 fs-17 align-middle" />}
                                        <span className="align-middle">{t(item.label, item.label)}</span>
                                    </DropdownItem>
                                )}
                            </Fragment>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
};

export default UserProfile;
