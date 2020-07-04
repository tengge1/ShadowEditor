/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { MenuItem, MenuItemSeparator } from '../../ui/index';
import StringUtils from '../../utils/StringUtils';

/**
 * 资源菜单
 * @author tengge / https://github.com/tengge1
 */
class AssetsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleExportGeometry = this.handleExportGeometry.bind(this);
        this.handleExportObject = this.handleExportObject.bind(this);

        this.handleExportCollada = this.handleExportCollada.bind(this);
        this.handleExportDRACO = this.handleExportDRACO.bind(this);
        this.handleExportGLTF = this.handleExportGLTF.bind(this);
        this.handleExportOBJ = this.handleExportOBJ.bind(this);
        this.handleExportPLY = this.handleExportPLY.bind(this);
        this.handleExportSTLB = this.handleExportSTLB.bind(this);
        this.handleExportSTL = this.handleExportSTL.bind(this);
    }

    render() {
        return <MenuItem title={_t('Assets')}>
            <MenuItem title={_t('Export Geometry JSON File')}
                onClick={this.handleExportGeometry}
            />
            <MenuItem title={_t('Export Object JSON File')}
                onClick={this.handleExportObject}
            />
            <MenuItemSeparator />
            <MenuItem title={_t('Export Collada')}
                onClick={this.handleExportCollada}
            />
            <MenuItem title={_t('Export DRACO')}
                onClick={this.handleExportDRACO}
            />
            <MenuItem title={_t('Export GLTF')}
                onClick={this.handleExportGLTF}
            />
            <MenuItem title={_t('Export OBJ')}
                onClick={this.handleExportOBJ}
            />
            <MenuItem title={_t('Export PLY')}
                onClick={this.handleExportPLY}
            />
            <MenuItem title={_t('Export STL Binary')}
                onClick={this.handleExportSTLB}
            />
            <MenuItem title={_t('Export STL')}
                onClick={this.handleExportSTL}
            />
        </MenuItem>;
    }

    // ------------------------------- 导出几何体 ----------------------------------------

    handleExportGeometry() {
        var editor = app.editor;

        var object = editor.selected;

        if (object === null) {
            app.toast(_t('Please select object!'), 'warn');
            return;
        }

        var geometry = object.geometry;

        if (geometry === undefined) {
            app.toast(_t('The object you selected is not geometry.'), 'warn');
            return;
        }

        var output = geometry.toJSON();

        try {
            output = JSON.stringify(output, StringUtils.parseNumber, '\t');
            // eslint-disable-next-line
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        } catch (e) {
            output = JSON.stringify(output);
        }

        StringUtils.saveString(output, 'geometry.json');
    }

    // ------------------------------- 导出物体 ------------------------------------------

    handleExportObject() {
        var editor = app.editor;

        var object = editor.selected;

        if (object === null) {
            app.toast(_t('Please select object!'), 'warn');
            return;
        }

        var output = object.toJSON();

        try {
            output = JSON.stringify(output, StringUtils.parseNumber, '\t');
            // eslint-disable-next-line
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        } catch (e) {
            output = JSON.stringify(output);
        }

        StringUtils.saveString(output, 'model.json');
    }

    // ------------------------------ 导出Collada文件 ----------------------------------------

    handleExportCollada() {
        app.require('ColladaExporter').then(() => {
            var exporter = new THREE.ColladaExporter();

            exporter.parse(app.editor.scene, function (result) {
                StringUtils.saveString(result.data, 'model.dae');
            });
        });
    }

    // ------------------------------ 导出DRACO文件 ----------------------------------------

    handleExportDRACO() {
        if (!(app.editor.selected instanceof THREE.Mesh)) {
            app.toast(_t('Please select a mesh.'));
            return;
        }

        app.require('DRACOExporter').then(() => {
            var exporter = new THREE.DRACOExporter();

            var data = exporter.parse(app.editor.selected.geometry);

            StringUtils.saveString(data, 'model.drc');
        });
    }

    // ------------------------------ 导出gltf文件 ----------------------------------------

    handleExportGLTF() {
        app.require('GLTFExporter').then(() => {
            var exporter = new THREE.GLTFExporter();

            exporter.parse(app.editor.scene, function (result) {
                StringUtils.saveString(JSON.stringify(result), 'model.gltf');
            });
        });
    }

    // ------------------------------ 导出obj文件 -----------------------------------------

    handleExportOBJ() {
        var editor = app.editor;

        var object = editor.selected;

        if (object === null) {
            app.toast(_t('Please select object!'), 'warn');
            return;
        }

        app.require('OBJExporter').then(() => {
            var exporter = new THREE.OBJExporter();
            StringUtils.saveString(exporter.parse(object), 'model.obj');
        });
    }

    // ------------------------------- 导出ply文件 ----------------------------------------

    handleExportPLY() {
        var editor = app.editor;

        var object = editor.selected;

        if (object === null) {
            app.toast(_t('Please select object!'), 'warn');
            return;
        }

        app.require('PLYExporter').then(() => {
            var exporter = new THREE.PLYExporter();
            StringUtils.saveString(exporter.parse(object, {
                excludeAttributes: ['normal', 'uv', 'color', 'index']
            }), 'model.ply');
        });
    }

    // ------------------------------- 导出stl二进制文件 -----------------------------------

    handleExportSTLB() {
        var editor = app.editor;

        app.require('STLBinaryExporter').then(() => {
            var exporter = new THREE.STLBinaryExporter();
            StringUtils.saveString(exporter.parse(editor.scene), 'model.stl');
        });
    }

    // ------------------------------- 导出stl文件 -----------------------------------------

    handleExportSTL() {
        var editor = app.editor;

        app.require('STLExporter').then(() => {
            var exporter = new THREE.STLExporter();
            StringUtils.saveString(exporter.parse(editor.scene), 'model.stl');
        });
    }
}

export default AssetsMenu;