import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import AddObjectCommand from '../../command/AddObjectCommand';

/**
 * 模型窗口
 * @param {*} options 
 */
function ModelWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

ModelWindow.prototype = Object.create(UI.Control.prototype);
ModelWindow.prototype.constructor = ModelWindow;

ModelWindow.prototype.render = function () {
    var container = UI.create({
        xtype: 'window',
        id: 'modelWindow',
        parent: this.app.container,
        title: '添加模型',
        width: '800px',
        height: '500px',
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'button',
                text: '添加'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'imagelist',
                id: 'modelWindowImages'
            }]
        }]
    });
    container.render();
};

ModelWindow.prototype.show = function () {
    var app = this.app;
    var server = app.options.server;

    UI.get('modelWindow').show();

    // var loader = new THREE.BinaryLoader();

    // Ajax.getJson(`${server}/api/Model/List`, (obj) => {
    //     loader.load(server + obj.Data[0].Model, (geometry, materials) => {
    //         var mesh = new THREE.Mesh(geometry, materials);
    //         var cmd = new AddObjectCommand(mesh);
    //         cmd.execute();
    //     });
    // });

};

export default ModelWindow;