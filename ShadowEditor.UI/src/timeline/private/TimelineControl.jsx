import './css/TimelineControl.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Toolbar from '../../toolbar/Toolbar.jsx';
import ToolbarFiller from '../../toolbar/ToolbarFiller.jsx';
import ToolbarSeparator from '../../toolbar/ToolbarSeparator.jsx';
import IconButton from '../../form/IconButton.jsx';
import Label from '../../form/Label.jsx';

/**
 * 时间轴控制
 * @author tengge / https://github.com/tengge1
 */
class TimelineControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style } = this.props;

        return <Toolbar className={classNames('TimelineControl', className)} style={style}>
            <IconButton icon={'add'} title={'Add Layer'}></IconButton>
            <IconButton icon={'delete'} title={'Delete Layer'}></IconButton>
            <ToolbarSeparator></ToolbarSeparator>
            <IconButton icon={'backward'} title={'Slower'}></IconButton>
            <IconButton icon={'play'} title={'Play'}></IconButton>
            <IconButton icon={'pause'} title={'Pause'}></IconButton>
            <IconButton icon={'forward'} title={'Faster'}></IconButton>
            <IconButton icon={'stop'} title={'Stop'}></IconButton>
            <ToolbarSeparator></ToolbarSeparator>
            <Label>00:00</Label>
            <Label>X1</Label>
            <ToolbarFiller></ToolbarFiller>
            <Label>Double click the area below to add animation.</Label>
        </Toolbar>;
    }
}

TimelineControl.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

TimelineControl.defaultProps = {
    className: null,
    style: null,
};

export default TimelineControl;