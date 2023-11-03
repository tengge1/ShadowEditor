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
  /**
   * 格式化时间
   * @param {string} format 事件格式化的格式
   * @returns 格式化之后的时间
   */
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

    return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace('HH', hour).replace('mm', minute).replace('ss', second);
  },

  /**
   * 将秒数转换为hour:minute:seconds的格式
   * @param {number} seconds 秒数
   * @returns hour:minute:seconds格式的字符串
   */
  formatSeconds: function (seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var seconds = seconds % 60;

    var formattedTime = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

    if (hours > 0) {
      formattedTime = (hours < 10 ? '0' : '') + hours + ':' + formattedTime;
    }

    return formattedTime;
  },

  /**
   * 将hour:minute:seconds的格式时间转换为秒数
   * @param {string} timeString hour:minute:seconds格式的时间
   * @returns 返回此格式的总秒数
   */
  timeToSeconds: function (timeString) {
    var parts = timeString.split(':');
    var seconds = parseInt(parts.pop(), 10);
    var minutes = parts.length > 0 ? parseInt(parts.pop(), 10) : 0;
    var hours = parts.length > 0 ? parseInt(parts.pop(), 10) : 0;

    if (isNaN(hours)) {
      hours = 0;
    }
    return hours * 3600 + minutes * 60 + seconds;
  },
};

export default TimeUtils;
