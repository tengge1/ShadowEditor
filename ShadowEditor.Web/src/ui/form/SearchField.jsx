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
            categories: [],
            filterShow: false,
        };

        this.handleAdd = this.handleAdd.bind(this, props.onAdd);
        this.handleChange = this.handleChange.bind(this, props.onChange);
        this.handleInput = this.handleInput.bind(this, props.onInput);
        this.handleReset = this.handleReset.bind(this, props.onInput, props.onChange);
        this.handleShowFilter = this.handleShowFilter.bind(this);
        this.handleHideFilter = this.handleHideFilter.bind(this);
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this, props.onInput, props.onChange);
        this.stopPropagation = this.stopPropagation.bind(this);
    }

    render() {
        const { className, style, data, placeholder, addHidden } = this.props;
        const { value, categories, filterShow } = this.state;

        return <div className={classNames('SearchField', className)} onClick={this.stopPropagation}>
            <IconButton
                className={classNames(addHidden && 'hidden')}
                icon={'add'}
                onClick={this.handleAdd}></IconButton>
            <input
                className={'input'}
                style={style}
                placeholder={placeholder}
                value={value}
                onChange={this.handleChange}
                onInput={this.handleInput}
                onKeyDown={this.handleKeyDown}
            />
            <IconButton
                icon={'close'}
                onClick={this.handleReset}></IconButton>
            <IconButton
                icon={'filter'}
                className={classNames(filterShow && 'selected')}
                onClick={this.handleShowFilter}></IconButton>
            <div className={classNames('category', !filterShow && 'hidden')}>
                <div className={'item'} key={''}>
                    <CheckBox name={''} checked={categories.indexOf('') > -1} onChange={this.handleCheckBoxChange}></CheckBox>
                    <label className={'title'}>{_t('No Type')}</label>
                </div>
                {data.map(n => {
                    return <div className={'item'} key={n.ID}>
                        <CheckBox
                            name={n.ID}
                            checked={categories.indexOf(n.ID) > -1}
                            onChange={this.handleCheckBoxChange}></CheckBox>
                        <label className={'title'}>{n.Name}</label>
                    </div>;
                })}
            </div>
        </div>;
    }

    componentDidMount() {
        document.addEventListener(`click`, this.handleHideFilter);
    }

    handleAdd(onAdd, event) {
        onAdd && onAdd(event);
    }

    handleChange(onChange, event) {
        event.stopPropagation();

        const value = event.target.value;

        this.setState({ value });

        onChange && onChange(value, this.state.categories, event);
    }

    handleInput(onInput, event) {
        event.stopPropagation();

        const value = event.target.value;

        this.setState({ value });

        onInput && onInput(value, this.state.categories, event);
    }

    handleReset(onInput, onChange, event) {
        const value = '';

        this.setState({ value });

        onInput && onInput(value, this.state.categories, event);
        onChange && onChange(value, this.state.categories, event);
    }

    handleShowFilter(name, event) {
        this.setState({
            filterShow: !this.state.filterShow,
        });
    }

    handleHideFilter() {
        this.setState({
            filterShow: false,
        });
    }

    handleCheckBoxChange(onInput, onChange, checked, name, event) {
        let categories = this.state.categories;
        let index = categories.indexOf(name);

        if (checked && index === -1) {
            categories.push(name);
        } else if (!checked && index > -1) {
            categories.splice(index, 1);
        } else {
            console.warn(`SearchField: handleCheckBoxChange error.`);
            return;
        }

        const value = this.state.value;

        this.setState({ categories }, () => {
            onInput && onInput(value, categories, event);
            onChange && onChange(value, categories, event);
        });
    }

    stopPropagation(event) {
        event.nativeEvent.stopImmediatePropagation();
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
    addHidden: false,
};

export default SearchField;