import { useTranslation } from 'react-i18next';

import LangSwitch from './lang-switch';

let changedLang = false;
function Header() {
  const { t, i18n } = useTranslation();

  // Extract the lang parameter from the URL
  const searchParams = new URLSearchParams(window.location.search);
  const lang = searchParams.get('lang');

  // Set the language if the lang parameter is present
  if (lang && ['en', 'de'].includes(lang) && !changedLang) {
    //clear local storage
    localStorage.clear();
    i18n.changeLanguage(lang);
    changedLang = true;
  }

  return (
    <header className="max-w-screen-2xl w-full mx-auto py-3 box-border px-10 max-md:px-6">
      <div className="flex items-center justify-between">
        <div className="w-36 max-xl:w-28 max-sm:w-24">
          <img
            src="/logo.png"
            alt="Digital Assistant Logo"
            className="object-contain flex w-full h-full"
            // className="object-contain w-[212px] xl:w-[260px] object-left h-[120px] xl:h-[180px]"
          />
        </div>
        <h1
          className="text-4xl font-bold text-center text-white max-xl:text-3xl max-lg:hidden"
          style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
        >
          {t('hero-section.heading', 'TESTEN SIE DEN DIGITALEN ASSISTENTEN')}
        </h1>
        <div className="flex items-center gap-6">
          {/* Conditionally render the LangSwitch component */}
          {!lang && <LangSwitch locals={['en', 'de']} />}
        </div>
      </div>
      <h1
        className="font-bold text-center text-white text-3xl mt-3 lg:hidden"
        style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
      >
        {t('hero-section.heading', 'TESTEN SIE DEN DIGITALEN ASSISTENTEN')}
      </h1>
    </header>
  );
}

export default Header;
