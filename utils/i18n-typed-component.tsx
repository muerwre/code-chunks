import React from 'react';
import i18n from 'i18next';
import { initReactI18next, Trans as Translate } from 'react-i18next';
import en from './translations/en';

export const Trans = ({ i18nKey, ...props }: { i18nKey: keyof typeof en }) => {
  const forceUpdate = React.useState(null)[1];

  React.useEffect(() => {
    i18n.on('languageChanged', forceUpdate);

    return () => i18n.off('languageChanged', forceUpdate);
  }, []);

  return (<Translate {...props} i18nKey={i18nKey} />);
};

export type ITransKey = keyof typeof en;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      bindI18n: 'languageChanged',
    },
  });

export default i18n;
