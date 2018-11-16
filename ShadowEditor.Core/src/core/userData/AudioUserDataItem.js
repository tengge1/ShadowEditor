import UserDataItemBase from './UserDataItemBase';

function AudioUserDataItem(options) {
    UserDataItemBase.call(this, options);

    this.type = 'audio';
    this.name = options.name || '(未知)';
    this.url = options.url || '';
};

AudioUserDataItem.prototype = Object.create(UserDataItemBase.prototype);
AudioUserDataItem.prototype.constructor = AudioUserDataItem;

export default AudioUserDataItem;