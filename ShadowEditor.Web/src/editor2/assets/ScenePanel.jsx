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

        this.handleClick = this.handleClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.state = {
            data: [],
        };
    }

    render() {
        const { data } = this.state;

        const imageListData = data.map(n => {
            return {
                id: n.ID,
                src: n.Thumbnail ? n.Thumbnail : null,
                title: n.Name,
                icon: 'scenes',
                cornerText: `v${n.Version}`,
            };
        });

        return <div className={'ScenePanel'}>
            <SearchField
                placeholder={L_SEARCH_CONTENT}
                addHidden={true}
                onInput={this.handleSearch.bind(this)}></SearchField>
            <ImageList
                data={imageListData}
                onClick={this.handleClick}
                onEdit={this.handleEdit}
                onDelete={this.handleDelete}></ImageList>
        </div>;
    }

    componentDidMount() {
        Ajax.getJson(`/api/Scene/List`, obj => {
            this.setState({
                data: obj.Data,
            });
        });
    }

    handleSearch() {

    }

    handleClick(data) {
        debugger
    }

    handleEdit(data) {

    }

    handleDelete(data) {

    }
}

export default ScenePanel;