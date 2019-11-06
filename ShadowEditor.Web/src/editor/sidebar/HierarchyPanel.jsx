import './css/HierarchyPanel.css';
import { Tree } from '../../third_party';
import MoveObjectCommand from '../../command/MoveObjectCommand';

/**
 * 场景树状图
 * @author tengge / https://github.com/tengge1
 */
class HierarchyPanel extends React.Component {
    constructor(props) {
        super(props);

        this.expanded = {};
        this.checked = {};

        this.state = {
            data: [],
            selected: null
        };

        this.updateUI = this.updateUI.bind(this);
        this.handleObjectSelected = this.handleObjectSelected.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleClickVisible = this.handleClickVisible.bind(this);

        this.handleExpand = this.handleExpand.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    render() {
        const { data, selected, checked } = this.state;

        return <Tree
            data={data}
            selected={selected}
            checked={checked}
            onSelect={this.handleSelect}
            onCheck={this.handleCheck}
            onDoubleClick={this.handleDoubleClick}
            onClickIcon={this.handleClickVisible}
            onExpand={this.handleExpand}
            onDrop={this.handleDrop}
               />;
    }

    componentDidMount() {
        app.on(`sceneGraphChanged.HierarchyPanel`, this.updateUI);

        // bug: https://gitee.com/tengge1/ShadowEditor/issues/ITCA9
        app.on(`objectChanged.HierarchyPanel`, this.updateUI);

        app.on(`objectRemoved.HierarchyPanel`, this.updateUI);

        app.on(`objectSelected.HierarchyPanel`, this.handleObjectSelected);
    }

    /**
     * 单击树节点
     * @param {*} value uuid值
     */
    handleSelect(value) {
        this.setState({
            selected: value
        });
        app.editor.selectByUuid(value);
    }

    handleCheck(value, name) {
        let checked = this.checked;

        if (value && !checked[name]) {
            checked[name] = true;
        } else if (!value && checked[name]) {
            delete checked[name];
        } else {
            console.warn(`HierarchyPanel: handleCheck error.`);
        }

        this.updateUI();
    }

    handleDoubleClick(value) {
        this.setState({
            selected: value
        });
        app.editor.focusByUUID(value);
    }

    handleClickVisible(value) {
        let obj = app.editor.objectByUuid(value);

        if (obj) {
            obj.visible = !obj.visible;
            app.call(`objectChanged`, this, obj.visible);
            // this.updateUI();
        }
    }

    /**
     * 选中物体改变
     * @param {*} object 当前选中物体
     */
    handleObjectSelected(object) {
        this.setState({
            selected: object ? object.uuid : null
        });
    }

    /**
     * 根据场景变化，更新场景树状图
     */
    updateUI() {
        const scene = app.editor.scene;
        const camera = app.editor.camera;

        let list = [{
            value: camera.uuid,
            text: camera.name,
            cls: 'Camera',
            expanded: false,
            checked: this.checked[camera.uuid] || false,
            draggable: false,
            children: []
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
            checked: this.checked[obj.uuid] || false,
            draggable: obj !== scene && obj !== camera,
            cls: cls,
            children: [],
            icons: [{
                name: 'visible',
                icon: obj.visible ? 'visible' : 'invisible'
            }]
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
     * @param {*} value uuid值
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
     * @param {*} value uuid值
     * @param {*} newParentValue 新的父节点值
     * @param {*} newBeforeValue 旧的父节点值
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