import UI from '../../ui/UI';

/**
 * 设置面板
 * @author mrdoob / http://mrdoob.com/
 */
function SettingPanel(app) {
    this.app = app;
    var editor = this.app.editor;

    var config = editor.config;

    var container = new UI.Div({
        cls: 'Panel',
        style: 'border-top: 0; padding-top: 20px;'
    });

    // class

    var options = {
        'assets/css/light.css': '浅色',
        'assets/css/dark.css': '深色'
    };

    var themeRow = new UI.Row();

    var theme = new UI.Select({
        options: options,
        value: config.getKey('theme'),
        style: 'width: 150px',
        onChange: function () {
            var value = this.getValue();

            editor.setTheme(value);
            editor.config.setKey('theme', value);
        }
    });

    themeRow.add(new UI.Label({
        text: '主题',
        style: 'width: 90px'
    }));

    themeRow.add(theme);

    container.add(themeRow);

    container.render();

    return container.dom;
};

export default SettingPanel;