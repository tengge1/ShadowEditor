import './css/ScenePanel.css';

import { classNames, PropTypes, SearchField, ImageList } from '../../third_party';
import Ajax from '../../utils/Ajax';
import Converter from '../../serialization/Converter';
import GISScene from '../../gis/Scene';

/**
 * 场景面板
 * @author tengge / https://github.com/tengge1
 */
class ScenePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }

    render() {
        const { data } = this.state;

        return <div className={'ScenePanel'}>
            <SearchField></SearchField>
            <ImageList data={data}></ImageList>
        </div>;
    }

    componentDidMount() {
        Ajax.getJson(`/api/Scene/List`, obj => {
            this.setState({
                data: obj.Data,
            });
            // this.data = obj.Data;
            // search.setValue('');
            // this.onSearch();
        });
    }
}

export default ScenePanel;