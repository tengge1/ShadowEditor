import BaseHelper from './BaseHelper';

/**
 * 选择帮助器
 * @param {*} app 
 */
function SelectHelper(app) {
    BaseHelper.call(this, app);
}

SelectHelper.prototype = Object.create(BaseHelper.prototype);
SelectHelper.prototype.constructor = SelectHelper;

SelectHelper.prototype.start = function () {

};

SelectHelper.prototype.stop = function () {

};

export default SelectHelper;