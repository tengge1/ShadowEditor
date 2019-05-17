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
 */
class EToolbar extends React.Component {
    render() {
        const { className, ...others } = this.props;

        return <Toolbar className={classNames('EToolbar', className)} direction={'vertical'} {...others}>
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
};

export default EToolbar;