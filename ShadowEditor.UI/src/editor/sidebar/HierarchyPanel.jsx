import './css/HierarchyPanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Panel from '../../panel/Panel.jsx';
import Tree from '../../tree/Tree.jsx';

/**
 * 场景树状图
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class HierarchyPanel extends React.Component {
    constructor(props) {
        super(props);

        this.data = [{
            value: '1',
            text: 'Programmer',
            expand: true,
            children: [{
                value: '11',
                text: 'Front-end',
                expand: true,
                children: [{
                    value: '111',
                    text: 'HTML',
                }, {
                    value: '112',
                    text: 'CSS',
                }, {
                    value: '113',
                    text: 'JS'
                }]
            }, {
                value: '12',
                text: 'Back-end',
                children: [{
                    value: '121',
                    text: 'Java',
                }, {
                    value: '122',
                    text: 'C#',
                }]
            }]
        }, {
            value: '2',
            text: 'Testing',
            expand: true,
            children: [{
                value: '21',
                text: 'Black Box Test'
            }, {
                value: '22',
                text: 'White Box Test'
            }]
        }];
    }

    render() {
        const { className, style } = this.props;

        return <Tree data={this.data}>
        </Tree>;
    }
}

HierarchyPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default HierarchyPanel;