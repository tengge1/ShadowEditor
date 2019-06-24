import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import SearchField from '../../form/SearchField.jsx';
import ImageList from '../../image/ImageList.jsx';

/**
 * 场景面板
 * @author tengge / https://github.com/tengge1
 */
class ScenePanel extends React.Component {
    render() {
        return <div className={'ScenePanel'}>
            <SearchField></SearchField>
            <ImageList></ImageList>
        </div>;
    }
}

export default ScenePanel;