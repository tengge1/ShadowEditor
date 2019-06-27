import UI from '../../../ui/UI';

/**
 * 外观选项窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SurfacePanel(options) {
    UI.Control.call(this, options);
}

SurfacePanel.prototype = Object.create(UI.Control.prototype);
SurfacePanel.prototype.constructor = SurfacePanel;

SurfacePanel.prototype.render = function () {
    UI.create({
        xtype: 'div',
        id: 'panel',
        scope: this.id,
        parent: this.parent,
        style: this.style,
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: L_THEME
            }, {
                xtype: 'select',
                id: 'theme',
                scope: this.id,
                options: {
                    'assets/css/light.css': L_LIGHT_COLOR,
                    'assets/css/dark.css': L_DARK_COLOR
                },
                style: {
                    width: '150px'
                },
                onChange: this.save.bind(this)
            }]
        }]
    }).render();

    this.dom = UI.get('panel', this.id).dom;
};

SurfacePanel.prototype.update = function () {
    var theme = UI.get('theme', this.id);

    if (!app.storage.get('theme')) {
        app.storage.set('theme', 'assets/css/light.css');
    }

    theme.setValue(app.storage.get('theme'));
};

SurfacePanel.prototype.save = function () {
    var theme = UI.get('theme', this.id).getValue();
    app.storage.set('theme', theme)
    document.getElementById('theme').href = theme;
};

export default SurfacePanel;