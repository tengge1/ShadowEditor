import './css/HierarchyPanel.css';
import { classNames, PropTypes, Tree } from '../../third_party';

/**
 * 场景树状图
 * @author tengge / https://github.com/tengge1
 */
class HierarchyPanel extends React.Component {
    constructor(props) {
        super(props);

        this.data = [{
            value: '1',
            text: 'Programmer',
            expand: true,
            checked: false,
            children: [{
                value: '11',
                text: 'Front-end',
                expand: true,
                checked: true,
                children: [{
                    value: '111',
                    text: 'HTML',
                    checked: true,
                }, {
                    value: '112',
                    text: 'CSS',
                    checked: true,
                }, {
                    value: '113',
                    text: 'JS',
                    checked: false,
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
        return <Tree data={this.data}></Tree>;
    }
}

export default HierarchyPanel;