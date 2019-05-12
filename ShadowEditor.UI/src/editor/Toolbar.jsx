import './css/Toolbar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import _Toolbar from '../toolbar/Toolbar.jsx';
import Icon from '../icon/Icon.jsx';

/**
 * 工具栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class Toolbar extends React.Component {
    render() {
        const { className, style } = this.props;

        return <_Toolbar direction={'vertical'} className={classNames('EditorToolbar', className)} style={style}>
            <Icon icon={'select'}></Icon>
            <Icon icon={'translate'}></Icon>
            <Icon icon={'rotate'}></Icon>
            <Icon icon={'scale'}></Icon>
            <Icon icon={'point'}></Icon>
            <Icon icon={'line'}></Icon>
            <Icon icon={'spray'}></Icon>
            <Icon icon={'texture'}></Icon>
        </_Toolbar>;
    }
}

Toolbar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default Toolbar;