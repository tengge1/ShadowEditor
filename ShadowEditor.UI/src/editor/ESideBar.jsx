import './css/ESideBar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import TabLayout from '../layout/TabLayout.jsx';
import VBoxLayout from '../layout/VBoxLayout.jsx';

import Panel from '../panel/Panel.jsx';

import HierarchyPanel from './sidebar/HierarchyPanel.jsx';

/**
 * 侧边栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class ESideBar extends React.Component {
    render() {
        const { className, style } = this.props;

        return <VBoxLayout className={classNames('ESideBar', className)} style={style}>
            <TabLayout className={'top'}>
                <HierarchyPanel title={'Hierarchy'} />
                <Panel title={'History'} header={false}></Panel>
            </TabLayout>
            <TabLayout className={'bottom'}>
                <Panel title={'Property'} header={false}></Panel>
                <Panel title={'Animation'} header={false}></Panel>
            </TabLayout>
        </VBoxLayout>;
    }
}

ESideBar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default ESideBar;