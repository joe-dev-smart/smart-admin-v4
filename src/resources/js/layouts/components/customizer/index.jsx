import { useLayoutContext } from '@/context/useLayoutContext';
import { toPascalCase } from '@/helpers/casing';
import SimpleBar from 'simplebar-react';
import { Fragment } from 'react';
import { Button, Col, Offcanvas, Row } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import { TbX } from 'react-icons/tb';

// Layout preview images from public folder
const layoutImages = '/images/layouts';

const skinOptions = [
    { skin: 'classic', image: `${layoutImages}/classic.png` },
    { skin: 'material', image: `${layoutImages}/material.png` },
    { skin: 'modern', image: `${layoutImages}/modern.png` },
    { skin: 'saas', image: `${layoutImages}/saas.png` },
    { skin: 'flat', image: `${layoutImages}/flat.png` },
    { skin: 'minimal', image: `${layoutImages}/minimal.png` },
    { skin: 'galaxy', image: `${layoutImages}/galaxy.png`, disabled: true },
];

const themeOptions = [
    { theme: 'light', image: `${layoutImages}/light.png` },
    { theme: 'dark', image: `${layoutImages}/dark.png` },
    { theme: 'system', image: `${layoutImages}/system.png` },
];

const orientationOptions = [
    { orientation: 'vertical', image: `${layoutImages}/vertical.png` },
    { orientation: 'horizontal', image: `${layoutImages}/horizontal.png` },
];

const topBarColorOptions = [
    { color: 'light', image: `${layoutImages}/topbar-light.png` },
    { color: 'dark', image: `${layoutImages}/topbar-dark.png` },
    { color: 'gray', image: `${layoutImages}/topbar-gray.png` },
    { color: 'gradient', image: `${layoutImages}/topbar-gradient.png` },
];

const sidenavColorOptions = [
    { color: 'light', image: `${layoutImages}/sidenav-light.png` },
    { color: 'dark', image: `${layoutImages}/sidenav-dark.png` },
    { color: 'gray', image: `${layoutImages}/sidenav-gray.png` },
    { color: 'gradient', image: `${layoutImages}/sidenav-gradient.png` },
    { color: 'image', image: `${layoutImages}/sidenav-image.png` },
];

const sidenavSizeOptions = [
    { size: 'default', image: `${layoutImages}/sidenav-default.png`, label: 'Default' },
    { size: 'compact', image: `${layoutImages}/sidenav-compact.png`, label: 'Compact' },
    { size: 'condensed', image: `${layoutImages}/sidenav-condensed.png`, label: 'Condensed' },
    { size: 'on-hover', image: `${layoutImages}/sidenav-hover.png`, label: 'On Hover' },
    { size: 'on-hover-active', image: `${layoutImages}/sidenav-hover-active.png`, label: 'On Hover - Show' },
    { size: 'offcanvas', image: `${layoutImages}/sidenav-offcanvas.png`, label: 'Offcanvas' },
];

const layoutPositionOptions = [
    { position: 'fixed' },
    { position: 'scrollable' },
];

const Customizer = () => {
    const {
        customizer,
        skin,
        changeSkin,
        theme,
        changeTheme,
        orientation,
        changeOrientation,
        topBar,
        changeTopBarColor,
        sidenav,
        changeSideNavColor,
        changeSideNavSize,
        position,
        changeLayoutPosition,
        toggleSideNavUser,
        reset,
    } = useLayoutContext();

    return (
        <Offcanvas show={customizer.isOpen} onHide={customizer.toggle} placement="end" className="overflow-hidden">
            <div className="d-flex justify-content-between text-bg-primary gap-2 p-3">
                <div>
                    <h5 className="mb-1 fw-bold text-white text-uppercase">Admin Customizer</h5>
                    <p className="text-white text-opacity-75 fst-italic fw-medium mb-0">
                        Easily configure layout, styles, and preferences for your admin interface.
                    </p>
                </div>

                <div className="flex-grow-0">
                    <button onClick={customizer.toggle} type="button" className="d-block btn btn-sm bg-white bg-opacity-25 text-white rounded-circle btn-icon">
                        <TbX className="fs-lg" />
                    </button>
                </div>
            </div>

            <SimpleBar className="offcanvas-body p-0 h-100">
                <div className="p-3 border-bottom border-dashed">
                    <h5 className="mb-3 fw-bold">Select Theme</h5>
                    <Row className="g-3">
                        {skinOptions.map((item, idx) => (
                            <Col sm={6} key={idx}>
                                <div className="form-check card-radio">
                                    <input
                                        id={`skin-${item.skin}`}
                                        className="form-check-input"
                                        type="radio"
                                        name="data-skin"
                                        disabled={item.disabled ?? false}
                                        value={item.skin}
                                        checked={skin === item.skin}
                                        onChange={() => changeSkin(item.skin)}
                                    />
                                    <label className="form-check-label p-0 w-100" htmlFor={`skin-${item.skin}`}>
                                        <div className="bg-light rounded p-3 text-center" style={{ minHeight: '80px' }}>
                                            <span className="text-muted">{toPascalCase(item.skin)}</span>
                                        </div>
                                    </label>
                                </div>
                                <h5 className="text-center text-muted mt-2 mb-0">{toPascalCase(item.skin)}</h5>
                            </Col>
                        ))}
                    </Row>
                </div>

                <div className="p-3 border-bottom border-dashed">
                    <h5 className="mb-3 fw-bold">Color Scheme</h5>
                    <Row className="g-3">
                        {themeOptions.map((item, idx) => (
                            <Col sm={4} key={idx}>
                                <div className="form-check card-radio">
                                    <input
                                        id={`theme-${item.theme}`}
                                        className="form-check-input"
                                        type="radio"
                                        name="data-bs-theme"
                                        value={item.theme}
                                        checked={theme === item.theme}
                                        onChange={() => changeTheme(item.theme)}
                                    />
                                    <label className="form-check-label p-0 w-100" htmlFor={`theme-${item.theme}`}>
                                        <div className="bg-light rounded p-2 text-center" style={{ minHeight: '60px' }}>
                                            <span className="text-muted small">{toPascalCase(item.theme)}</span>
                                        </div>
                                    </label>
                                </div>
                                <h5 className="text-center text-muted mt-2 mb-0">{toPascalCase(item.theme)}</h5>
                            </Col>
                        ))}
                    </Row>
                </div>

                <div className="p-3 border-bottom border-dashed">
                    <h5 className="mb-3 fw-bold">Topbar Color</h5>
                    <Row className="g-3">
                        {topBarColorOptions.map((item, idx) => (
                            <Col sm={4} key={idx}>
                                <div className="form-check card-radio">
                                    <input
                                        id={`topbar-color-${item.color}`}
                                        className="form-check-input"
                                        type="radio"
                                        name="data-topbar-color"
                                        value={item.color}
                                        checked={topBar.color === item.color}
                                        onChange={() => changeTopBarColor(item.color)}
                                    />
                                    <label className="form-check-label p-0 w-100" htmlFor={`topbar-color-${item.color}`}>
                                        <div className="bg-light rounded p-2 text-center" style={{ minHeight: '60px' }}>
                                            <span className="text-muted small">{toPascalCase(item.color)}</span>
                                        </div>
                                    </label>
                                </div>
                                <h5 className="text-center text-muted mt-2 mb-0">{toPascalCase(item.color)}</h5>
                            </Col>
                        ))}
                    </Row>
                </div>

                <div className="p-3 border-bottom border-dashed">
                    <h5 className="mb-3 fw-bold">Orientation</h5>
                    <Row className="g-3">
                        {orientationOptions.map((item, idx) => (
                            <Col sm={4} key={idx}>
                                <div className="form-check card-radio">
                                    <input
                                        id={`layout-${item.orientation}`}
                                        className="form-check-input"
                                        type="radio"
                                        name="data-layout"
                                        value={item.orientation}
                                        checked={orientation === item.orientation}
                                        onChange={() => changeOrientation(item.orientation)}
                                    />
                                    <label className="form-check-label p-0 w-100" htmlFor={`layout-${item.orientation}`}>
                                        <div className="bg-light rounded p-2 text-center" style={{ minHeight: '60px' }}>
                                            <span className="text-muted small">{toPascalCase(item.orientation)}</span>
                                        </div>
                                    </label>
                                </div>
                                <h5 className="text-center text-muted mt-2 mb-0">{toPascalCase(item.orientation)}</h5>
                            </Col>
                        ))}
                    </Row>
                </div>

                <div className="p-3 border-bottom border-dashed">
                    <h5 className="mb-3 fw-bold">Sidenav Color</h5>
                    <Row className="g-3">
                        {sidenavColorOptions.map((item, idx) => (
                            <Col sm={4} key={idx}>
                                <div className="form-check card-radio">
                                    <input
                                        id={`sidenav-color-${item.color}`}
                                        className="form-check-input"
                                        type="radio"
                                        name="data-menu-color"
                                        value={item.color}
                                        checked={sidenav.color === item.color}
                                        onChange={() => changeSideNavColor(item.color)}
                                    />
                                    <label className="form-check-label p-0 w-100" htmlFor={`sidenav-color-${item.color}`}>
                                        <div className="bg-light rounded p-2 text-center" style={{ minHeight: '60px' }}>
                                            <span className="text-muted small">{toPascalCase(item.color)}</span>
                                        </div>
                                    </label>
                                </div>
                                <h5 className="text-center text-muted mt-2 mb-0">{toPascalCase(item.color)}</h5>
                            </Col>
                        ))}
                    </Row>
                </div>

                {orientation !== 'horizontal' && (
                    <>
                        <div className="p-3 border-bottom border-dashed">
                            <h5 className="mb-3 fw-bold">Sidebar Size</h5>
                            <Row className="g-3">
                                {sidenavSizeOptions.map((item, idx) => (
                                    <Col sm={4} key={idx}>
                                        <div className="form-check card-radio">
                                            <input
                                                id={`sidenav-size-${item.size}`}
                                                className="form-check-input"
                                                type="radio"
                                                name="data-sidenav-size"
                                                value={item.size}
                                                checked={sidenav.size === item.size}
                                                onChange={() => changeSideNavSize(item.size)}
                                            />
                                            <label className="form-check-label p-0 w-100" htmlFor={`sidenav-size-${item.size}`}>
                                                <div className="bg-light rounded p-2 text-center" style={{ minHeight: '60px' }}>
                                                    <span className="text-muted small">{item.label}</span>
                                                </div>
                                            </label>
                                        </div>
                                        <h5 className="text-center text-muted mt-2 mb-0">{item.label}</h5>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        <div className="p-3 border-bottom border-dashed">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0">Layout Position</h5>

                                <div className="btn-group radio" role="group">
                                    {layoutPositionOptions.map((item, idx) => (
                                        <Fragment key={idx}>
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="data-layout-position"
                                                id={`position-${item.position}`}
                                                value={item.position}
                                                checked={position === item.position}
                                                onChange={() => changeLayoutPosition(item.position)}
                                            />
                                            <label className="btn btn-sm btn-soft-warning w-sm" htmlFor={`position-${item.position}`}>
                                                {toPascalCase(item.position)}
                                            </label>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <label className="fw-bold m-0" htmlFor="sidebaruser-check">
                                        Sidebar User Info
                                    </label>
                                </h5>

                                <div className="form-check form-switch fs-lg">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="sidebar-user"
                                        checked={sidenav.user}
                                        onChange={toggleSideNavUser}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </SimpleBar>

            <div className="offcanvas-footer border-top p-3 text-center">
                <Row>
                    <Col sm={6}>
                        <Button variant="light" type="button" onClick={reset} className="fw-semibold py-2 w-100">
                            Reset
                        </Button>
                    </Col>
                    <Col sm={6}>
                        <Button variant="primary" className="py-2 fw-semibold w-100" onClick={customizer.toggle}>
                            Close
                        </Button>
                    </Col>
                </Row>
            </div>
        </Offcanvas>
    );
};

export default Customizer;
