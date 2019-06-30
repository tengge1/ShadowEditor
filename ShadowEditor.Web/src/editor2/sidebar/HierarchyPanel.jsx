import './css/HierarchyPanel.css';
import { classNames, PropTypes, Tree } from '../../third_party';

/**
 * 场景树状图
 * @author tengge / https://github.com/tengge1
 */
class HierarchyPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    render() {
        const { data } = this.state;

        return <Tree data={data} onSelect={this.handleSelect}></Tree>;
    }

    componentDidMount() {
        app.on(`sceneGraphChanged.${this.id}`, this.updateUI.bind(this));

        // bug: https://gitee.com/tengge1/ShadowEditor/issues/ITCA9
        app.on(`objectChanged.${this.id}`, this.updateUI.bind(this));

        app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    }

    /**
     * 单击树节点
     * @param {*} data 
     */
    handleSelect(data) {
        // app.editor.selectByUuid(data.value);
    }

    onDblClick(data) {
        app.editor.focusByUUID(data.value);
    }

    /**
     * 选中物体改变
     * @param {*} object 
     */
    onObjectSelected(object) {
        // var tree = UI.get('tree', this.id);

        // if (!object) {
        //     var selected = tree.getSelected();
        //     if (selected) {
        //         tree.unselect(selected.value);
        //     }
        //     return;
        // }

        // tree.select(object.uuid);
    }

    /**
     * 根据场景变化，更新场景树状图
     */
    updateUI() {
        var scene = app.editor.scene;
        var camera = app.editor.camera;

        var list = [{
            value: camera.uuid,
            text: camera.name,
            cls: 'Camera',
            children: [],
            checked: false,
        }];

        this._parseData(scene, list);

        this.setState({ data: list });
    }

    _parseData(obj, list) {
        var scene = app.editor.scene;

        var cls = null;

        if (obj === scene) {
            cls = 'Scene';
        } else if (obj instanceof THREE.Line) {
            cls = 'Line';
        } else if (obj instanceof THREE.Light) {
            cls = 'Light';
        } else if (obj instanceof THREE.Points) {
            cls = 'Points';
        } else {
            cls = 'Default';
        }

        var data = {
            value: obj.uuid,
            text: obj.name,
            expand: obj === scene,
            draggable: obj !== scene,
            cls: cls,
            children: [],
            checked: false,
        };
        list.push(data);

        if (Array.isArray(obj.children)) {
            obj.children.forEach(n => {
                this._parseData(n, data.children);
            });
        }
    }

    /**
     * 拖动节点
     */
    onDrag(objData, newParentData, newBeforeData) {
        var object, newParent, newBefore;

        var editor = app.editor;

        object = editor.objectByUuid(objData.value);
        newParent = editor.objectByUuid(newParentData.value);

        if (newBeforeData) {
            newBefore = editor.objectByUuid(newBeforeData.value);
        }

        app.editor.execute(new MoveObjectCommand(object, newParent, newBefore));

        var tree = UI.get('tree', this.id);
        tree.expand(newParentData.value);
    }
}

export default HierarchyPanel;