/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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