import { userDropdownItems } from '@/layouts/components/data';
import { Image } from 'react-bootstrap';
import { Link, usePage } from '@inertiajs/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { TbChevronDown } from 'react-icons/tb';

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
        <div className="topbar-item nav-user">
            <Dropdown align="end">
                <DropdownToggle as={'a'} className="topbar-link dropdown-toggle drop-arrow-none px-2">
                    <Image
                        src={`${usersPath}/user-2.jpg`}
                        width="32"
                        height="32"
                        className="rounded-circle me-lg-2 d-flex"
                        alt="user-image"
                    />
                    <div className="d-lg-flex align-items-center gap-1 d-none">
                        <h5 className="my-0">{user?.name || 'Usuario'}</h5>
                        <TbChevronDown className="align-middle" />
                    </div>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
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
    );
};

export default UserProfile;
