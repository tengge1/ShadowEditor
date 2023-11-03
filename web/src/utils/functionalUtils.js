/*
 * @Author: wangzhiyu
 * @Date: 2023-10-11 15:47:36
 * @LastEditors: wangzhiyu
 * @LastEditTime: 2023-10-11 15:48:43
 */

/**
 * 节流函数
 * @param {function} func
 * @param {number} delay
 * @returns 返回节流处理后的函数
 */
export function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();
    const remainingTime = delay - (currentTime - lastExecTime);

    clearTimeout(timeoutId);

    if (remainingTime <= 0) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, remainingTime);
    }
  };
}
