import UI from '../../ui/UI';

/**
 * 状态菜单（菜单栏右侧）
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function StatusMenu(options) {
    UI.Control.call(this, options);
    options = options || {};

    this.app = options.app;
}

StatusMenu.prototype = Object.create(UI.Control.prototype);
StatusMenu.prototype.constructor = StatusMenu;

StatusMenu.prototype.render = function () {
    var lang = window.localStorage.getItem('lang') || 'zh-CN';

    var container = UI.create({
        xtype: 'div',
        id: 'mStatus',
        parent: this.parent,
        cls: 'menu right',
        children: [{
            xtype: 'button',
            cls: lang === 'en-US' ? 'IconButton selected' : 'IconButton',
            id: 'btnEnglish',
            scope: this.id,
            text: 'English',
            onClick: () => {
                this.selectLanguage('en-US');
            }
        }, {
            xtype: 'button',
            id: 'btnChinese',
            scope: this.id,
            text: '中文',
            cls: lang === 'zh-CN' ? 'IconButton selected' : 'IconButton',
            style: {
                padding: '4px 8px'
            },
            onClick: () => {
                this.selectLanguage('zh-CN')
            }
        }, {
            xtype: 'text',
            text: 'r' + THREE.REVISION,
            cls: 'title version'
        }]
    });

    container.render();
}

StatusMenu.prototype.selectLanguage = function (lang) {
    var oldLang = this.app.storage.get('lang') || 'zh-CN';

    if (oldLang === lang) {
        return;
    }

    this.app.storage.set('lang', lang);

    var btnEnglish = UI.get('btnEnglish', this.id);
    var btnChinese = UI.get('btnChinese', this.id);

    if (lang === 'en-US') { // English
        btnEnglish.dom.className = 'IconButton selected';
        btnChinese.dom.className = 'IconButton';

        UI.confirm('Confirm', 'Language will change to English after reload. Reload now?', (event, btn) => {
            if (btn === 'ok') {
                window.location.reload();
            }
        });
    } else { // Chinese
        btnEnglish.dom.className = 'IconButton';
        btnChinese.dom.className = 'IconButton selected';

        UI.confirm('确认', '语言将在刷新后切换到中文，是否现在刷新？', (event, btn) => {
            if (btn === 'ok') {
                window.location.reload();
            }
        });
    }
};

export default StatusMenu;