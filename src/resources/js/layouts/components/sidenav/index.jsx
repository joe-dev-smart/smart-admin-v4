import SimpleBar from 'simplebar-react';
import { useLayoutContext } from '@/context/useLayoutContext';
import AppMenu from '@/layouts/components/sidenav/components/AppMenu';
import UserProfile from '@/layouts/components/sidenav/components/UserProfile';
import { Image } from 'react-bootstrap';
import { IconMenu4, IconX } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

const Sidenav = () => {
    const { sidenav, hideBackdrop, changeSideNavSize } = useLayoutContext();

    const toggleSidebar = () => {
        changeSideNavSize(
            sidenav.size === 'on-hover-active' ? 'on-hover' : 'on-hover-active'
        );
    };

    const closeSidebar = () => {
        const html = document.documentElement;
        html.classList.toggle('sidebar-enable');
        hideBackdrop();
    };

    return (
        <div className="sidenav-menu">
            <Link href="/" className="logo">
                <span className="logo logo-light">
                    <span className="logo-lg">
                        <Image
                            src="/images/logo.png"
                            alt="logo"
                            width={92.3}
                            height={26}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <span className="fs-5 fw-bold text-primary ms-2">Smart Admin</span>
                    </span>
                    <span className="logo-sm">
                        <span className="fs-5 fw-bold text-primary">SA</span>
                    </span>
                </span>

                <span className="logo logo-dark">
                    <span className="logo-lg">
                        <Image
                            src="/images/logo-black.png"
                            alt="dark logo"
                            width={92.3}
                            height={26}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <span className="fs-5 fw-bold text-white ms-2">Smart Admin</span>
                    </span>
                    <span className="logo-sm">
                        <span className="fs-5 fw-bold text-white">SA</span>
                    </span>
                </span>
            </Link>

            <button className="button-on-hover" onClick={toggleSidebar}>
                <IconMenu4 className="fs-22 align-middle" />
            </button>

            <button className="button-close-offcanvas" onClick={closeSidebar}>
                <IconX className="align-middle" />
            </button>

            <SimpleBar id="sidenav" className="scrollbar">
                {sidenav.user && <UserProfile />}
                <AppMenu />
            </SimpleBar>
        </div>
    );
};

export default Sidenav;
