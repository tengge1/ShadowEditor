import './css/SearchField.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import IconButton from './IconButton.jsx';
import CheckBox from './CheckBox.jsx';

/**
 * 搜索框
 * @author tengge / https://github.com/tengge1
 */
class SearchField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            filterShow: false,
        };

        this.handleAdd = this.handleAdd.bind(this, props.onAdd);
        this.handleChange = this.handleChange.bind(this, props.onChange);
        this.handleInput = this.handleInput.bind(this, props.onInput);
        this.handleReset = this.handleReset.bind(this, props.onReset);
        this.handleShowFilter = this.handleShowFilter.bind(this);
    }

    render() {
        const { className, style, data, placeholder, addHidden } = this.props;
        const { value, filterShow } = this.state;

        return <div className={classNames('SearchField', className)}>
            <IconButton
                className={classNames(addHidden && 'hidden')}
                icon={'add'}
                onClick={this.handleAdd}></IconButton>
            <input
                className={'input'}
                style={style}
                value={value}
                placeholder={placeholder}
                onChange={this.handleChange}
                onInput={this.handleInput}
            />
            <IconButton
                icon={'close'}
                onClick={this.handleReset}></IconButton>
            <IconButton
                icon={'filter'}
                className={classNames(filterShow && 'selected')}
                onClick={this.handleShowFilter}></IconButton>
            <div className={classNames('category', !filterShow && 'hidden')}>
                {data.map(n => {
                    return <div className={'item'}>
                        <CheckBox name={n.ID}></CheckBox>
                        <label className={'title'}>{n.Name}</label>
                    </div>;
                })}
            </div>
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
        this.setState({
            value: '',
        });
        onReset && onReset(event);
    }

    handleShowFilter() {
        this.setState({
            filterShow: !this.state.filterShow,
        });
    }
}

SearchField.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
    data: PropTypes.array,
    placeholder: PropTypes.string,
    onAdd: PropTypes.func,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
    onReset: PropTypes.func,
    handleShowFilter: PropTypes.func,
    addHidden: PropTypes.bool,
};

SearchField.defaultProps = {
    className: null,
    style: null,
    value: '',
    data: [],
    placeholder: 'Enter a keyword',
    onAdd: null,
    onChange: null,
    onInput: null,
    onReset: null,
    handleShowFilter: null,
    addHidden: false,
};

export default SearchField;