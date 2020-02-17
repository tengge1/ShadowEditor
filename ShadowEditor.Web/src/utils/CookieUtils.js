import { Cookies } from '../third_party';

const CookieUtils = {
    /**
     * 清空所有cookie
     * @see https://blog.csdn.net/qq_37164847/article/details/82700520
     */
    clearAll: function () {
        const cookies = Cookies.get();
        Object.keys(cookies).forEach(n => {
            Cookies.remove(n);
        });
    }
};

export default CookieUtils;