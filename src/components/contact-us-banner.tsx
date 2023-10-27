import { XMarkIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

function ContactUsBanner() {
  const [hidden, setHidden] = useState(false);
  const { t } = useTranslation();

  const handleClose = () => setHidden(true);

  if (hidden) return null;

  return (
    <div className="flex items-center gap-x-6 bg-gray-900 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <p className="text-sm leading-6 text-white">
        <a href={process.env.REACT_APP_CONTACT_US_URL || 'mailto:chatbot@tamerin.tech'}>
          <Trans t={t} i18nKey="banner.contact-us">
            <strong className="font-medium">Kontaktieren Sie uns </strong>
            für Ihren individuellen, digitalen Assistenten! chatbot@tamerin.tech
            <span aria-hidden="true"> →</span>
          </Trans>
        </a>
      </p>
      <div className="flex flex-1 justify-end">
        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]" onClick={handleClose}>
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default ContactUsBanner;
