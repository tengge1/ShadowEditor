import './css/DisplayProperty.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Button from '../form/Button.jsx';

/**
 * 展示属性
 * @author tengge / https://github.com/tengge1
 */
class DisplayProperty extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this, props.onClick);
    }

    render() {
        const { className, style, value, btnShow, btnText } = this.props;

        return <div className={classNames('wrap', className)}
            style={style}
               >
            <div className={'label'}>{value}</div>
            {btnShow && <Button className={'button'}
                onClick={this.handleClick}
                        >{btnText}</Button>}
        </div>;
    }

    handleClick(onClick, name, event) {
        onClick && onClick(this.props.name, event);
    }
}

DisplayProperty.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.string,
    btnShow: PropTypes.bool,
    btnText: PropTypes.string,
    onClick: PropTypes.func
};

DisplayProperty.defaultProps = {
    className: null,
    style: null,
    name: 'name',
    value: '',
    btnShow: false,
    btnText: 'Button',
    onClick: null
};

export default DisplayProperty;