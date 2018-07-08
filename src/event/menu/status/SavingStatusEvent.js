import MenuEvent from '../MenuEvent';

/**
 * 保存状态改变
 * @param {*} app 
 */
function SavingStatusEvent(app) {
    MenuEvent.call(this, app);
}

SavingStatusEvent.prototype = Object.create(MenuEvent.prototype);
SavingStatusEvent.prototype.constructor = SavingStatusEvent;

SavingStatusEvent.prototype.start = function () {
    this.app.on('initApp.' + this.id, this.onInitApp.bind(this));
    this.app.on('savingStarted.' + this.id, this.onSavingStarted.bind(this));
    this.app.on('savingFinished.' + this.id, this.onSavingFinished.bind(this));
};

SavingStatusEvent.prototype.stop = function () {
    this.app.on('initApp.' + this.id, null);
    this.app.on('savingStarted.' + this.id, null);
    this.app.on('savingFinished.' + this.id, null);
};

SavingStatusEvent.prototype.onInitApp = function () {
    document.querySelector('#bAutoSave > input').checked = this.app.editor.config.getKey('autosave');
};

SavingStatusEvent.prototype.onSavingStarted = function () {
    document.querySelector('#bAutoSave > span').style.textDecoration = 'underline';
};

SavingStatusEvent.prototype.onSavingFinished = function () {
    document.querySelector('#bAutoSave > span').style.textDecoration = 'none';
};

export default SavingStatusEvent;