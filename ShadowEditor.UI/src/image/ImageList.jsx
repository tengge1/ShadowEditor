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

        this.pageSize = 6;
        this.pageNum = 0;

        this.handleClick = this.handleClick.bind(this, onClick);
        this.handleEdit = this.handleEdit.bind(this, onEdit);
        this.handleDelete = this.handleDelete.bind(this, onDelete);
    }

    render() {
        const { className, style, data } = this.props;

        return <div className={classNames('ImageList', className)} style={style}>
            <div className={'content'}>
                {data.map(n => {
                    return <div className={'item'} data-id={n.id} key={n.id} onClick={this.handleClick}>
                        {n.src ?
                            <img className={'img'} src={n.src}></img> :
                            <div className={'no-img'}>
                                <Icon icon={n.icon}></Icon>
                            </div>}
                        <div className={'title'}>{n.title}</div>
                        {n.cornerText && <div className={'cornerText'}>{n.cornerText}</div>}
                        <IconButton className={'edit'} icon={'edit'} data-id={n.id} onClick={this.handleEdit}></IconButton>
                        <IconButton className={'delete'} icon={'delete'} data-id={n.id} onClick={this.handleDelete}></IconButton>
                    </div>;
                })}
            </div>
            <div className={'page'}>
                <IconButton icon={'backward'}></IconButton>
                <IconButton icon={'left-triangle2'}></IconButton>
                <Input className={'current'} value={'1'} />
                <IconButton icon={'right-triangle2'}></IconButton>
                <IconButton icon={'forward'}></IconButton>
                <div class={'info'}>
                    共<span>20</span>页
                </div>
            </div>
        </div>;
    }

    handleClick(onClick, event) {
        event.stopPropagation();

        const id = event.target.getAttribute('data-id');
        const data = this.props.data.filter(n => n.id === id)[0];

        onClick && onClick(data, event);
    }

    handleEdit(onEdit, event) {
        event.stopPropagation();

        const id = event.target.getAttribute('data-id');
        const data = this.props.data.filter(n => n.id === id)[0];

        onEdit && onEdit(data, event);
    }

    handleDelete(onDelete, event) {
        event.stopPropagation();

        const id = event.target.getAttribute('data-id');
        const data = this.props.data.filter(n => n.id === id)[0];

        onDelete && onDelete(data, event);
    }
}

ImageList.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.array,
    onClick: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

ImageList.defaultProps = {
    className: null,
    style: null,
    data: [],
    onClick: null,
    onEdit: null,
    onDelete: null,
};

export default ImageList;