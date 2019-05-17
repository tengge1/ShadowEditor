import './css/ESideBar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import TabLayout from '../layout/TabLayout.jsx';
import VBoxLayout from '../layout/VBoxLayout.jsx';

import HierarchyPanel from './sidebar/HierarchyPanel.jsx';
import HistoryPanel from './sidebar/HistoryPanel.jsx';
import PropertyPanel from './sidebar/PropertyPanel.jsx';
import AnimationPanel from './sidebar/AnimationPanel.jsx';

/**
 * 侧边栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} region 区域
 */
class ESideBar extends React.Component {
    render() {
        const { className, style, region } = this.props;

        return <VBoxLayout region={region} className={classNames('ESideBar', className)} style={style}>
            <TabLayout className={'top'}>
                <HierarchyPanel title={'Hierarchy'} />
                <HistoryPanel title={'History'}></HistoryPanel>
            </TabLayout>
            <TabLayout className={'bottom'}>
                <PropertyPanel title={'Property'}></PropertyPanel>
                <AnimationPanel title={'Animation'}></AnimationPanel>
            </TabLayout>
        </VBoxLayout>;
    }
}

ESideBar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    region: PropTypes.string,
};

export default ESideBar;