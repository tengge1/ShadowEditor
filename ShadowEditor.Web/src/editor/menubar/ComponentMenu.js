import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';

/**
 * 组件菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ComponentMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

ComponentMenu.prototype = Object.create(UI.Control.prototype);
ComponentMenu.prototype.constructor = ComponentMenu;

ComponentMenu.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '组件'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: '刚体',
                cls: 'option',
                onClick: function () {

                }
            }, {
                xtype: 'div',
                html: '碰撞体',
                cls: 'option',
                onClick: function () {

                }
            }, {
                xtype: 'div',
                html: '背景音乐',
                cls: 'option',
                onClick: this.onAddBackgroundMusic.bind(this)
            }, {
                xtype: 'div',
                html: '粒子发射器',
                cls: 'option',
                onClick: function () {
                    _this.app.call('mParticleEmitter');
                }
            }]
        }]
    });

    container.render();
}

ComponentMenu.prototype.onAddBackgroundMusic = function () {
    var editor = this.app.editor;
    var listener = editor.audioListener;

    var audio = new THREE.Audio(listener);
    audio.name = `背景音乐`;
    audio.autoplay = true;
    audio.setLoop(true);
    audio.setVolume(1.0);

    this.app.editor.execute(new AddObjectCommand(audio));
};

export default ComponentMenu;