import './css/EToolbar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Toolbar from '../toolbar/Toolbar.jsx';
import ToolbarSeparator from '../toolbar/ToolbarSeparator.jsx';
import IconButton from '../form/IconButton.jsx';

/**
 * 工具栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} region 区域
 */
class EToolbar extends React.Component {
    render() {
        const { className, style, region } = this.props;

        return <Toolbar direction={'vertical'} region={region} className={classNames('EToolbar', className)} style={style}>
            <IconButton icon={'select'}></IconButton>
            <IconButton icon={'translate'}></IconButton>
            <IconButton icon={'rotate'}></IconButton>
            <IconButton icon={'scale'}></IconButton>
            <ToolbarSeparator />
            <IconButton icon={'point'}></IconButton>
            <IconButton icon={'line'}></IconButton>
            <IconButton icon={'spray'}></IconButton>
            <IconButton icon={'texture'}></IconButton>
        </Toolbar>;
    }
}

EToolbar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    region: PropTypes.string,
};

export default EToolbar;