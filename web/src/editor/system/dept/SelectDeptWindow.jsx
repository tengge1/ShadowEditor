/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/SelectDeptWindow.css';
import { PropTypes } from '../../../third_party';
import { Window, Content, Toolbar, Button, Tree, Buttons } from '../../../ui/index';

/**
 * 选择组织机构窗口
 * @author tengge / https://github.com/tengge1
 */
class SelectDeptWindow extends React.Component {
    constructor(props) {
        super(props);

        this.list = [];
        this.expanded = {};

        this.state = {
            data: [],
            selected: null
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleOK = this.handleOK.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    render() {
        const { data, selected } = this.state;

        return <Window
            className={'SelectDeptWindow'}
            title={_t('Select Department Window')}
            style={{ width: '280px', height: '400px' }}
            mask={false}
            onClose={this.handleCancel}
               >
            <Content>
                <Toolbar>
                    <Button onClick={this.handleRefresh}>{_t('Refresh')}</Button>
                </Toolbar>
                <div className={'box'}>
                    <Tree className={'tree'}
                        data={data}
                        selected={selected}
                        onSelect={this.handleSelect}
                        onExpand={this.handleExpand}
                    />
                </div>
            </Content>
            <Buttons>
                <Button onClick={this.handleOK}>{_t('OK')}</Button>
                <Button onClick={this.handleCancel}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        this.handleRefresh();
    }

    handleRefresh() {
        fetch(`${app.options.server}/api/Department/List?pageSize=10000`).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                this.list = obj.Data;
                this.refreshTree();
            });
        });
    }

    refreshTree() {
        var data = [];
        this.createTree(data, '', this.list);
        this.setState({
            data
        });
    }

    createTree(nodes, parentID, list) {
        var list1 = list.filter(n => n.ParentID === parentID);

        list1.forEach(obj1 => {
            var node1 = {
                value: obj1.ID,
                text: obj1.Name,
                children: [],
                expanded: !!this.expanded[obj1.ID]
            };
            this.createTree(node1.children, obj1.ID, list);
            nodes.push(node1);
        });
    }

    handleSelect(selected) {
        const data = this.list.filter(n => n.ID === selected)[0];

        this.setState({
            selected,
            deptName: data.Name,
            adminName: ''
        });
    }

    handleExpand(value) {
        let expanded = this.expanded;

        if (expanded[value]) {
            expanded[value] = false;
        } else {
            expanded[value] = true;
        }

        this.refreshTree();
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleOK() {
        const selected = this.state.selected;
        const callback = this.props.callback;

        if (!selected) {
            app.toast(_t('Please select a department.'));
            return;
        }

        const dept = this.list.filter(n => n.ID === selected)[0];

        this.handleCancel();

        callback && callback(dept.ID, dept.Name, dept);
    }

    handleCancel() {
        app.removeElement(this);
    }
}

SelectDeptWindow.propTypes = {
    callback: PropTypes.func
};

SelectDeptWindow.defaultProps = {
    callback: null
};

export default SelectDeptWindow;