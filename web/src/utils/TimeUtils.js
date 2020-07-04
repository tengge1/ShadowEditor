/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * 时间工具
 * @author tengge / https://github.com/tengge1
 */
const TimeUtils = {
    getDateTime: function (format = 'yyyyMMddHHmmss') {
        let date = new Date();
        let year = date.getFullYear();
        let month = `00${date.getMonth() + 1}`;
        let day = `00${date.getDate()}`;
        let hour = `00${date.getHours()}`;
        let minute = `00${date.getMinutes()}`;
        let second = `00${date.getSeconds()}`;

        month = month.substr(month.length - 2, 2);
        day = day.substr(day.length - 2, 2);
        hour = hour.substr(hour.length - 2, 2);
        minute = minute.substr(minute.length - 2, 2);
        second = second.substr(second.length - 2, 2);

        return format.replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second);
    }
};

export default TimeUtils;