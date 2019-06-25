import './css/SearchField.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import IconButton from './IconButton.jsx';

/**
 * 搜索框
 * @author tengge / https://github.com/tengge1
 */
class SearchField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };

        this.handleChange = this.handleChange.bind(this, props.onChange);
        this.handleInput = this.handleInput.bind(this, props.onInput);
    }

    handleChange(onChange, event) {
        this.setState({
            value: event.target.value,
        });
        onChange && onChange(event.target.value, event);
    }

    handleInput(onInput, event) {
        this.setState({
            value: event.target.value,
        });
        onInput && onInput(event.target.value, event);
    }

    render() {
        const { className, style, value, onChange, onInput, ...others } = this.props;

        return <div className={'SearchField'}>
            <input
                className={classNames('input', className)}
                style={style}
                value={this.state.value}
                placeholder={'Enter a keyword'}
                onChange={this.handleChange}
                onInput={this.handleInput}
                {...others} />
            <IconButton icon={'close'}></IconButton>
        </div>;
    }
}

SearchField.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
};

SearchField.defaultProps = {
    className: null,
    style: null,
    value: '',
    onChange: null,
    onInput: null,
};

export default SearchField;