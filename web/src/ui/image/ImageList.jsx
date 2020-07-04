/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/ImageList.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Icon from '../icon/Icon.jsx';
import IconButton from '../form/IconButton.jsx';
import Input from '../form/Input.jsx';

/**
 * 图片列表
 * @author tengge / https://github.com/tengge1
 */
class ImageList extends React.Component {
    constructor(props) {
        super(props);

        const { onClick, onEdit, onDelete } = props;

        this.state = {
            pageSize: 10,
            pageNum: 0
        };

        this.handleFirstPage = this.handleFirstPage.bind(this);
        this.handleLastPage = this.handleLastPage.bind(this);
        this.handlePreviousPage = this.handlePreviousPage.bind(this);
        this.handleNextPage = this.handleNextPage.bind(this);

        this.handleClick = this.handleClick.bind(this, onClick);
        this.handleEdit = this.handleEdit.bind(this, onEdit);
        this.handleDelete = this.handleDelete.bind(this, onDelete);
        this.handleError = this.handleError.bind(this);
    }

    render() {
        const { className, style, data, showEditButton, showDeleteButton } = this.props;
        const { pageSize, pageNum } = this.state;

        const totalPage = this.getTotalPage();

        const current = data.filter((n, i) => {
            return i >= pageSize * pageNum && i < pageSize * (pageNum + 1);
        });

        return <div className={classNames('ImageList', className)}
            style={style}
               >
            <div className={'content'}>
                {current.map(n => {
                    return <div className={'item'}
                        name={n.id}
                        key={n.id}
                        onClick={this.handleClick}
                           >
                        {n.src ?
                            <img className={'img'}
                                src={n.src}
                                onError={this.handleError}
                            /> :
                            <div className={'no-img'}>
                                <Icon icon={n.icon} />
                            </div>}
                        <div className={'title'}>{n.title}</div>
                        {n.cornerText && <div className={'cornerText'}>{n.cornerText}</div>}
                        {showEditButton && n.showEditButton !== false && <IconButton className={'edit'}
                            icon={'edit'}
                            name={n.id}
                            onClick={this.handleEdit}
                                                                         />}
                        {showDeleteButton && n.showDeleteButton !== false && <IconButton className={'delete'}
                            icon={'delete'}
                            name={n.id}
                            onClick={this.handleDelete}
                                                                             />}
                    </div>;
                })}
            </div>
            <div className={'page'}>
                <IconButton icon={'backward'}
                    title={_t('First Page')}
                    onClick={this.handleFirstPage}
                />
                <IconButton icon={'left-triangle2'}
                    title={_t('Previous Page')}
                    onClick={this.handlePreviousPage}
                />
                <Input className={'current'}
                    value={(pageNum + 1).toString()}
                    title={_t('Current Page')}
                    disabled
                />
                <IconButton icon={'right-triangle2'}
                    title={_t('Next Page')}
                    onClick={this.handleNextPage}
                />
                <IconButton icon={'forward'}
                    title={_t('Last Page')}
                    onClick={this.handleLastPage}
                />
                <div className={'info'}>
                    {_t('Total {{totalPage}} Pages', { totalPage: totalPage })}
                </div>
            </div>
        </div>;
    }

    handleFirstPage() {
        this.setState({
            pageNum: 0
        });
    }

    handleLastPage() {
        const totalPage = this.getTotalPage();

        this.setState({
            pageNum: totalPage < 1 ? 0 : totalPage - 1
        });
    }

    handleNextPage() {
        this.setState(state => {
            const totalPage = this.getTotalPage();

            return {
                pageNum: state.pageNum < totalPage - 1 ? state.pageNum + 1 : totalPage - 1
            };
        });
    }

    handlePreviousPage() {
        this.setState(state => {
            return {
                pageNum: state.pageNum > 0 ? state.pageNum - 1 : 0
            };
        });
    }

    handleClick(onClick, event) {
        event.stopPropagation();

        const id = event.target.getAttribute('name');
        const data = this.props.data.filter(n => n.id === id)[0];

        onClick && onClick(data, event);
    }

    handleEdit(onEdit, name, event) {
        event.stopPropagation();

        const data = this.props.data.filter(n => n.id === name)[0];

        onEdit && onEdit(data, event);
    }

    handleDelete(onDelete, name, event) {
        event.stopPropagation();

        const data = this.props.data.filter(n => n.id === name)[0];

        onDelete && onDelete(data, event);
    }

    handleError(event) {
        let target = event.target;
        let parent = target.parentNode;
        parent.removeChild(target);

        let img = document.createElement('div');
        img.className = 'no-img';

        let icon = document.createElement('i');
        icon.className = 'Icon iconfont icon-scenes';
        img.appendChild(icon);

        let title = parent.children[0];
        parent.insertBefore(img, title);
    }

    getTotalPage() {
        const total = this.props.data.length;
        const pageSize = this.state.pageSize;
        return total % pageSize === 0 ? total / pageSize : parseInt(total / pageSize) + 1;
    }
}

ImageList.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.array,
    showEditButton: PropTypes.bool,
    showDeleteButton: PropTypes.bool,
    onClick: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};

ImageList.defaultProps = {
    className: null,
    style: null,
    data: [],
    showEditButton: true,
    showDeleteButton: true,
    onClick: null,
    onEdit: null,
    onDelete: null
};

export default ImageList;