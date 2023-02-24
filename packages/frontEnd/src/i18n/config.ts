import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { globalStore } from '@/stores';

import enJSON from './en.json';
import zhJSON from './zh.json';

const resources = {
    en: {
        translation: enJSON,
    },
    zh: {
        translation: zhJSON,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'zh',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;