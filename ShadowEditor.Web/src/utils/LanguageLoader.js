import { i18next, Backend } from '../third_party';

/**
 * 语言加载器
 * @author tengge / https://github.com/tengge1
 */
class LanguageLoader {
    constructor() {
        window.i18next = i18next;
        window._t = i18next.t.bind(i18next);
    }

    load() {
        let lang = window.localStorage.getItem('lang');

        if (!lang) {
            let language = window.navigator.language.toLocaleLowerCase();

            if (language === 'zh-cn') {
                lang = 'zh-CN';
            } else {
                lang = 'en-US';
            }
        }

        return new Promise(resolve => {
            i18next.use(Backend)
                .init({
                    lng: lang,
                    debug: false,

                    whitelist: ['en-US', 'zh-CN', 'zh-TW', 'ja-JP', 'ko-KR', 'ru-RU', 'fr-FR'],

                    backend: {
                        // for all available options read the backend's repository readme file
                        loadPath: 'locales/{{lng}}.json'
                    },

                    // allow keys to be phrases having `:`, `.`
                    nsSeparator: false,
                    keySeparator: false,

                    // do not load a fallback
                    fallbackLng: false
                }, (err) => {
                    if (err) {
                        console.warn(err);
                    }
                    resolve();
                });
        });
    }
}

export default LanguageLoader;