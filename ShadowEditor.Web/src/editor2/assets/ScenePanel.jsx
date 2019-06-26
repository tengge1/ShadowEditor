import { classNames, PropTypes, SearchField, ImageList } from '../../third_party';

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