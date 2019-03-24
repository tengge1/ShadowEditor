import UI from '../../ui/UI';
import SurfacePanel from './options/SurfacePanel';
import RendererPanel from './options/RendererPanel';
import HelperPanel from './options/HelperPanel';

/**
 * 选项窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function OptionsWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.tab = L_SURFACE;
}

OptionsWindow.prototype = Object.create(UI.Control.prototype);
OptionsWindow.prototype.constructor = OptionsWindow;

OptionsWindow.prototype.render = function () {
    this.surfacePanel = new SurfacePanel({
        app: this.app
    });
    this.rendererPanel = new RendererPanel({
        app: this.app
    });
    this.helperPanel = new HelperPanel({
        app: this.app
    });

    this.window = UI.create({
        xtype: 'window',
        parent: this.app.container,
        title: L_OPTIONS_WINDOW,
        width: '500px',
        height: '300px',
        bodyStyle: {
            padding: 0
        },
        shade: false,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            children: [{
                xtype: 'text',
                id: 'surfaceTab',
                scope: this.id,
                text: L_SURFACE,
                cls: 'selected',
                onClick: () => {
                    this.changeTab(L_SURFACE);
                }
            }, {
                xtype: 'text',
                id: 'helperTab',
                scope: this.id,
                text: L_HELPERS,
                onClick: () => {
                    this.changeTab(L_HELPERS);
                }
            }, {
                xtype: 'text',
                id: 'rendererTab',
                scope: this.id,
                text: L_RENDERER,
                onClick: () => {
                    this.changeTab(L_RENDERER);
                }
            }]
        },
        this.surfacePanel,
        this.helperPanel,
        this.rendererPanel,
        ],
        buttons: [{
            xtype: 'button',
            text: L_SAVE,
            onClick: () => {
                this.save();
            }
        }, {
            xtype: 'button',
            text: L_CANCEL,
            onClick: () => {
                this.hide();
            }
        }]
    });
    this.window.render();
};

OptionsWindow.prototype.show = function () {
    this.window.show();
    this.update();
};

OptionsWindow.prototype.hide = function () {
    this.window.hide();
};

OptionsWindow.prototype.changeTab = function (name) {
    this.tab = name;

    var surfaceTab = UI.get('surfaceTab', this.id);
    var helperTab = UI.get('helperTab', this.id);
    var rendererTab = UI.get('rendererTab', this.id);

    surfaceTab.dom.classList.remove('selected');
    helperTab.dom.classList.remove('selected');
    rendererTab.dom.classList.remove('selected');

    this.surfacePanel.dom.style.display = 'none';
    this.helperPanel.dom.style.display = 'none';
    this.rendererPanel.dom.style.display = 'none';

    switch (this.tab) {
        case L_SURFACE:
            surfaceTab.dom.classList.add('selected');
            this.surfacePanel.dom.style.display = '';
            break;
        case L_HELPERS:
            helperTab.dom.classList.add('selected');
            this.helperPanel.dom.style.display = '';
            break;
        case L_RENDERER:
            rendererTab.dom.classList.add('selected');
            this.rendererPanel.dom.style.display = '';
            break;
    }

    this.update();
};

OptionsWindow.prototype.update = function () {
    switch (this.tab) {
        case L_SURFACE:
            this.surfacePanel.update();
            break;
        case L_HELPERS:
            this.helperPanel.update();
            break;
        case L_RENDERER:
            this.rendererPanel.update();
            break;
    }
};

OptionsWindow.prototype.save = function () {
    switch (this.tab) {
        case L_SURFACE:
            this.surfacePanel.save();
            break;
        case L_HELPERS:
            this.helperPanel.save();
            break;
        case L_RENDERER:
            this.rendererPanel.save();
            break;
    }
};

export default OptionsWindow;