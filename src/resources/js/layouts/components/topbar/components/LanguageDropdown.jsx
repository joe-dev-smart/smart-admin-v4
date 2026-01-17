import { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Image } from 'react-bootstrap';

// Flag images from public folder
const flagsPath = '/images/flags';



const availableLanguages = [{
  code: 'en',
  name: 'English',
  nativeName: 'English',
  flag: `${flagsPath}/us.svg`
}, {
  code: 'de',
  name: 'German',
  nativeName: 'Deutsch',
  flag: `${flagsPath}/de.svg`
}, {
  code: 'it',
  name: 'Italian',
  nativeName: 'Italiano',
  flag: `${flagsPath}/it.svg`
}, {
  code: 'es',
  name: 'Spanish',
  nativeName: 'Español',
  flag: `${flagsPath}/es.svg`
}, {
  code: 'ru',
  name: 'Russian',
  nativeName: 'Русский',
  flag: `${flagsPath}/ru.svg`
}, {
  code: 'hi',
  name: 'Hindi',
  nativeName: 'हिन्दी',
  flag: `${flagsPath}/in.svg`
}];
const LanguageDropdown = () => {
  const [language, setLanguage] = useState(availableLanguages[0]);
  return <div className="topbar-item">
      <Dropdown align="end">
        <DropdownToggle as={'button'} className="topbar-link fw-bold  drop-arrow-none">
          <Image src={language.flag} alt="user-image" className="w-100 rounded me-2" width="18" height="18" />
          <span> {language.code.toUpperCase()} </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {availableLanguages.map(lang => <DropdownItem key={lang.code} title={lang.name} onClick={() => setLanguage(lang)}>
              <Image src={lang.flag} alt="English" className="me-1 rounded" width="18" height="18" />
              <span className="align-middle">{lang.nativeName}</span>
            </DropdownItem>)}
        </DropdownMenu>
      </Dropdown>
    </div>;
};
export default LanguageDropdown;