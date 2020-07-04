/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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
            filterShow: false
        };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowFilter = this.handleShowFilter.bind(this);
        this.handleHideFilter = this.handleHideFilter.bind(this);
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
        this.stopPropagation = this.stopPropagation.bind(this);
    }

    render() {
        const { className, style, data, placeholder, showAddButton, showFilterButton } = this.props;
        const { value, categories, filterShow } = this.state;

        return <div className={classNames('SearchField', className)}
            onClick={this.stopPropagation}
               >
            {showAddButton && <IconButton icon={'add'}
                onClick={this.handleAdd}
                              />}
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
                onClick={this.handleReset}
            />
            {showFilterButton && <IconButton
                icon={'filter'}
                className={classNames(filterShow && 'selected')}
                onClick={this.handleShowFilter}
                                 />}
            {showFilterButton && <div className={classNames('category', !filterShow && 'hidden')}>
                <div className={'item'}
                    key={''}
                >
                    <CheckBox name={''}
                        checked={categories.indexOf('') > -1}
                        onChange={this.handleCheckBoxChange}
                    />
                    <label className={'title'}>{_t('No Type')}</label>
                </div>
                {data.map(n => {
                    return <div className={'item'}
                        key={n.ID}
                           >
                        <CheckBox
                            name={n.ID}
                            checked={categories.indexOf(n.ID) > -1}
                            onChange={this.handleCheckBoxChange}
                        />
                        <label className={'title'}>{n.Name}</label>
                    </div>;
                })}
            </div>}
        </div>;
    }

    componentDidMount() {
        document.addEventListener(`click`, this.handleHideFilter);
    }

    handleAdd(event) {
        const { onAdd } = this.props;
        onAdd && onAdd(event);
    }

    handleChange(event) {
        const { onChange } = this.props;

        event.stopPropagation();

        const value = event.target.value;

        this.setState({ value });

        onChange && onChange(value, this.state.categories, event);
    }

    handleInput(event) {
        const { onInput } = this.props;

        event.stopPropagation();

        const value = event.target.value;

        this.setState({ value });

        onInput && onInput(value, this.state.categories, event);
    }

    handleReset(event) {
        const { onInput, onChange } = this.props;
        const value = '';

        this.setState({ value });

        onInput && onInput(value, this.state.categories, event);
        onChange && onChange(value, this.state.categories, event);
    }

    handleShowFilter() {
        this.setState({
            filterShow: !this.state.filterShow
        });
    }

    handleHideFilter() {
        this.setState({
            filterShow: false
        });
    }

    handleCheckBoxChange(checked, name, event) {
        const { onInput, onChange } = this.props;

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
    showAddButton: PropTypes.bool,
    showFilterButton: PropTypes.bool,
    onAdd: PropTypes.func,
    onChange: PropTypes.func,
    onInput: PropTypes.func
};

SearchField.defaultProps = {
    className: null,
    style: null,
    value: '',
    data: [],
    placeholder: 'Enter a keyword',
    showAddButton: false,
    showFilterButton: false,
    onAdd: null,
    onChange: null,
    onInput: null
};

export default SearchField;