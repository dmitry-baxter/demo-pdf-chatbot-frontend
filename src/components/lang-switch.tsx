import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

interface Props {
  locals: string[];
}
function LangSwitch({ locals }: Props) {
  const { i18n } = useTranslation();

  const handleSwitch = (lng: string) => i18n.changeLanguage(lng);

  return (
    <span className="isolate inline-flex">
      {locals.map((local) => (
        <button
          key={local}
          type="button"
          className={classnames(
            'relative inline-flex items-center px-1.5 py-1 text-base font-bold uppercase',
            new Intl.Locale(i18n.language).language === local
              ? 'bg-dark-gray text-light-gray z-10'
              : 'bg-light-gray text-dark-gray'
          )}
          onClick={() => handleSwitch(local)}
        >
          {local}
        </button>
      ))}
    </span>
  );
}

export default LangSwitch;
