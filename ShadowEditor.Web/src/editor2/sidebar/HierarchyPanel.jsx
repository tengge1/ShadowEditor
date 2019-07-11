import './css/HierarchyPanel.css';
import { classNames, PropTypes, Tree } from '../../third_party';
import MoveObjectCommand from '../../command/MoveObjectCommand';

/**
 * 场景树状图
 * @author tengge / https://github.com/tengge1
 */
class HierarchyPanel extends React.Component {
    constructor(props) {
        super(props);

        this.expanded = {};

        this.state = {
            data: [],
            selected: null,
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    render() {
        const { data, selected } = this.state;

        return <Tree
            data={data}
            selected={selected}
            onSelect={this.handleSelect}
            onDoubleClick={this.handleDoubleClick}
            onExpand={this.handleExpand}
            onDrop={this.handleDrop}></Tree>;
    }

    componentDidMount() {
        app.on(`sceneGraphChanged.${this.id}`, this.updateUI.bind(this));

        // bug: https://gitee.com/tengge1/ShadowEditor/issues/ITCA9
        app.on(`objectChanged.${this.id}`, this.updateUI.bind(this));

        app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    }

    /**
     * 单击树节点
     * @param {*} value 
     */
    handleSelect(value) {
        this.setState({
            selected: value,
        });
        app.editor.selectByUuid(value);
    }

    handleDoubleClick(value) {
        this.setState({
            selected: value,
        });
        app.editor.focusByUUID(value);
    }

    /**
     * 选中物体改变
     * @param {*} object 
     */
    onObjectSelected(object) {
        this.setState({
            selected: object ? object.uuid : null,
        });
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
        const scene = app.editor.scene;
        const camera = app.editor.camera;

        let cls = null;

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

        let expanded = this.expanded;

        if (obj === scene && expanded[obj.uuid] === undefined) {
            expanded[obj.uuid] = true;
        }

        var data = {
            value: obj.uuid,
            text: obj.name,
            expanded: expanded[obj.uuid],
            draggable: obj !== scene && obj !== camera,
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
     * 展开关闭节点
     * @param {*} value 
     */
    handleExpand(value) {
        let expanded = this.expanded;

        if (expanded[value]) {
            expanded[value] = false;
        } else {
            expanded[value] = true;
        }

        this.updateUI();
    }

    /**
     * 拖动节点
     */
    handleDrop(value, newParentValue, newBeforeValue) {
        var editor = app.editor;

        let object = editor.objectByUuid(value);
        let newParent = editor.objectByUuid(newParentValue);
        let newBefore = null;

        if (newBeforeValue) {
            newBefore = editor.objectByUuid(newBeforeValue);
        }

        app.editor.execute(new MoveObjectCommand(object, newParent, newBefore));

        this.expanded[newParentValue] = true;

        this.updateUI();
    }
}

export default HierarchyPanel;