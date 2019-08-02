import UI from '../../ui/UI';
import StringUtils from '../../utils/StringUtils';

/**
 * 资源菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function AssetMenu(options) {
    UI.Control.call(this, options);
}

AssetMenu.prototype = Object.create(UI.Control.prototype);
AssetMenu.prototype.constructor = AssetMenu;

AssetMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: L_ASSETS
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: L_EXPORT_GEOMETRY,
                cls: 'option',
                onClick: this.onExportGeometry.bind(this)
            }, {
                xtype: 'div',
                html: L_EXPORT_OBJECT,
                cls: 'option',
                onClick: this.onExportObject.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: L_EXPORT_GLTF,
                cls: 'option',
                onClick: this.onExportGLTF.bind(this)
            }, {
                xtype: 'div',
                html: L_EXPORT_OBJ,
                cls: 'option',
                onClick: this.onExportOBJ.bind(this)
            }, {
                xtype: 'div',
                html: L_EXPORT_PLY,
                cls: 'option',
                onClick: this.onExportPLY.bind(this)
            }, {
                xtype: 'div',
                id: 'mExportSTLB',
                html: L_EXPORT_STL_BINARY,
                cls: 'option',
                onClick: this.onExportSTLB.bind(this)
            }, {
                xtype: 'div',
                id: 'mExportSTL',
                html: L_EXPORT_STL,
                cls: 'option',
                onClick: this.onExportSTL.bind(this)
            }]
        }]
    });

    container.render();
}

// ------------------------------- 导出几何体 ----------------------------------------

AssetMenu.prototype.onExportGeometry = function () {
    var editor = app.editor;

    var object = editor.selected;

    if (object === null) {
        UI.msg(L_PLEASE_SELECT_OBJECT);
        return;
    }

    var geometry = object.geometry;

    if (geometry === undefined) {
        UI.msg(L_OBJECT_SELECTED_IS_NOT_GEOMETRY);
        return;
    }

    var output = geometry.toJSON();

    try {
        output = JSON.stringify(output, parseNumber, '\t');
        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } catch (e) {
        output = JSON.stringify(output);
    }

    StringUtils.saveString(output, 'geometry.json');
};

// ------------------------------- 导出物体 ------------------------------------------

AssetMenu.prototype.onExportObject = function () {
    var editor = app.editor;

    var object = editor.selected;

    if (object === null) {
        UI.msg(L_PLEASE_SELECT_OBJECT);
        return;
    }

    var output = object.toJSON();

    try {
        output = JSON.stringify(output, parseNumber, '\t');
        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } catch (e) {
        output = JSON.stringify(output);
    }

    StringUtils.saveString(output, 'model.json');
};

// ------------------------------ 导出gltf文件 ----------------------------------------

AssetMenu.prototype.onExportGLTF = function () {
    app.require('GLTFExporter').then(() => {
        var exporter = new THREE.GLTFExporter();

        exporter.parse(app.editor.scene, function (result) {
            StringUtils.saveString(JSON.stringify(result), 'model.gltf');
        });
    });
};

// ------------------------------ 导出obj文件 -----------------------------------------

AssetMenu.prototype.onExportOBJ = function () {
    var editor = app.editor;

    var object = editor.selected;

    if (object === null) {
        UI.msg(L_PLEASE_SELECT_OBJECT);
        return;
    }

    app.require('OBJExporter').then(() => {
        var exporter = new THREE.OBJExporter();
        StringUtils.saveString(exporter.parse(object), 'model.obj');
    });
};

// ------------------------------- 导出ply文件 ----------------------------------------

AssetMenu.prototype.onExportPLY = function () {
    var editor = app.editor;

    var object = editor.selected;

    if (object === null) {
        UI.msg(L_PLEASE_SELECT_OBJECT);
        return;
    }

    app.require('PLYExporter').then(() => {
        var exporter = new THREE.PLYExporter();
        StringUtils.saveString(exporter.parse(object, {
            excludeAttributes: ['normal', 'uv', 'color', 'index']
        }), 'model.ply');
    });
};

// ------------------------------- 导出stl二进制文件 -----------------------------------

AssetMenu.prototype.onExportSTLB = function () {
    var editor = app.editor;

    app.require('STLBinaryExporter').then(() => {
        var exporter = new THREE.STLBinaryExporter();
        StringUtils.saveString(exporter.parse(editor.scene), 'model.stl');
    });
};

// ------------------------------- 导出stl文件 -----------------------------------------

AssetMenu.prototype.onExportSTL = function () {
    var editor = app.editor;

    app.require('STLExporter').then(() => {
        var exporter = new THREE.STLExporter();
        StringUtils.saveString(exporter.parse(editor.scene), 'model.stl');
    });
};

export default AssetMenu;