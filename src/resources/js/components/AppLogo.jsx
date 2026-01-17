import { Image } from 'react-bootstrap';
import { Link } from 'react-router';


const AppLogo = () => {
  return <>
      <Link href="/" className="logo-dark">
        <Image src={logoDark} alt="dark logo" height="32" />
      </Link>
      <Link href="/" className="logo-light">
        <Image src={logo} alt="logo" height="32" />
      </Link>
    </>;
};
export default AppLogo;