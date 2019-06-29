import './css/ImageList.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Icon from '../icon/Icon.jsx';

/**
 * 图片列表
 * @author tengge / https://github.com/tengge1
 */
class ImageList extends React.Component {
    render() {
        const { className, style, data } = this.props;

        return <div className={'ImageList'}>
            {data.map(n => {
                return <div className={'item'} key={n.ID}>
                    {n.Thumbnail ?
                        <img className={'img'} src={n.Thumbnail}></img> :
                        <div className={'no-img'}>
                            <Icon icon={'scenes'}></Icon>
                        </div>}
                    <div className={'title'}>{n.Name}</div>
                </div>;
            })}
        </div>;
    }
}

ImageList.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.array,
};

ImageList.defaultProps = {
    className: null,
    style: null,
    data: [],
};

export default ImageList;