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
    },
};

export default TimeUtils;