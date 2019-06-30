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

        this.handleAdd = this.handleAdd.bind(this, props.onAdd);
        this.handleChange = this.handleChange.bind(this, props.onChange);
        this.handleInput = this.handleInput.bind(this, props.onInput);
        this.handleReset = this.handleReset.bind(this, props.onReset);
        this.handleFilter = this.handleFilter.bind(this, props.onFilter);
    }

    render() {
        const { className, style, placeholder, addHidden } = this.props;

        return <div className={classNames('SearchField', className)}>
            <IconButton className={classNames(addHidden && 'hidden')} icon={'add'} onClick={this.handleAdd}></IconButton>
            <input
                className={'input'}
                style={style}
                value={this.state.value}
                placeholder={placeholder}
                onChange={this.handleChange}
                onInput={this.handleInput}
            />
            <IconButton icon={'close'} onClick={this.handleReset}></IconButton>
            <IconButton icon={'filter'} onClick={this.handleFilter}></IconButton>
        </div>;
    }

    handleAdd(onAdd, event) {
        onAdd && onAdd(event);
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

    handleReset(onReset, event) {
        onReset && onReset(event);
    }

    handleFilter(onFilter, event) {
        onFilter && onFilter(event);
    }
}

SearchField.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onAdd: PropTypes.func,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
    onReset: PropTypes.func,
    handleFilter: PropTypes.func,
    addHidden: PropTypes.bool,
};

SearchField.defaultProps = {
    className: null,
    style: null,
    value: '',
    placeholder: 'Enter a keyword',
    onAdd: null,
    onChange: null,
    onInput: null,
    onReset: null,
    handleFilter: null,
    addHidden: false,
};

export default SearchField;