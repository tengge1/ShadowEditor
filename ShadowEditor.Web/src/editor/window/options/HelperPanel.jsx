import './css/HelperPanel.css';
import { classNames, PropTypes, Window, Content, TabLayout, Buttons, Button, Form, FormControl, Label, Input, Select, CheckBox } from '../../../third_party';

/**
 * 帮助选项窗口
 * @author tengge / https://github.com/tengge1
 */
class HelperPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showGrid: false,
            showCamera: false,
            showPointLight: false,
            showDirectionalLight: false,
            showSpotLight: false,
            showHemisphereLight: false,
            showRectAreaLight: false,
            showSkeleton: false
        };

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { showGrid, showCamera, showPointLight, showDirectionalLight, showSpotLight, showHemisphereLight, showRectAreaLight, showSkeleton } = this.state;

        return <Form className={'HelperPanel'}>
            <FormControl>
                <Label>{_t('Grid')}</Label>
                <CheckBox name={'showGrid'}
                    checked={showGrid}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Camera')}</Label>
                <CheckBox name={'showCamera'}
                    checked={showCamera}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Point Light')}</Label>
                <CheckBox name={'showPointLight'}
                    checked={showPointLight}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Directional Light')}</Label>
                <CheckBox name={'showDirectionalLight'}
                    checked={showDirectionalLight}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Spot Light')}</Label>
                <CheckBox name={'showSpotLight'}
                    checked={showSpotLight}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Hemisphere Light')}</Label>
                <CheckBox name={'showHemisphereLight'}
                    checked={showHemisphereLight}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Rect Area Light')}</Label>
                <CheckBox name={'showRectAreaLight'}
                    checked={showRectAreaLight}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Skeleton')}</Label>
                <CheckBox name={'showSkeleton'}
                    checked={showSkeleton}
                    onChange={this.handleChange}
                />
            </FormControl>
        </Form>;
    }

    handleUpdate() {
        this.setState({
            showGrid: app.storage.get('showGrid') === true,
            showCamera: app.storage.get('showCamera') === true,
            showPointLight: app.storage.get('showPointLight') === true,
            showDirectionalLight: app.storage.get('showDirectionalLight') === true,
            showSpotLight: app.storage.get('showSpotLight') === true,
            showHemisphereLight: app.storage.get('showHemisphereLight') === true,
            showRectAreaLight: app.storage.get('showRectAreaLight') === true,
            showSkeleton: app.storage.get('showSkeleton') === true
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { showGrid, showCamera, showPointLight, showDirectionalLight,
            showSpotLight, showHemisphereLight, showRectAreaLight, showSkeleton } = Object.assign({}, this.state, {
                [name]: value
            });

        if (showGrid !== app.storage.get('showGrid')) {
            app.storage.set('showGrid', showGrid);
            app.call(`storageChanged`, this, 'showGrid', showGrid);
        }

        if (showCamera !== app.storage.get('showCamera')) {
            app.storage.set('showCamera', showCamera);
            app.call(`storageChanged`, this, 'showCamera', showCamera);
        }

        if (showPointLight !== app.storage.get('showPointLight')) {
            app.storage.set('showPointLight', showPointLight);
            app.call(`storageChanged`, this, 'showPointLight', showPointLight);
        }

        if (showDirectionalLight !== app.storage.get('showDirectionalLight')) {
            app.storage.set('showDirectionalLight', showDirectionalLight);
            app.call(`storageChanged`, this, 'showDirectionalLight', showDirectionalLight);
        }

        if (showSpotLight !== app.storage.get('showSpotLight')) {
            app.storage.set('showSpotLight', showSpotLight);
            app.call(`storageChanged`, this, 'showSpotLight', showSpotLight);
        }

        if (showHemisphereLight !== app.storage.get('showHemisphereLight')) {
            app.storage.set('showHemisphereLight', showHemisphereLight);
            app.call(`storageChanged`, this, 'showHemisphereLight', showHemisphereLight);
        }

        if (showRectAreaLight !== app.storage.get('showRectAreaLight')) {
            app.storage.set('showRectAreaLight', showRectAreaLight);
            app.call(`storageChanged`, this, 'showRectAreaLight', showRectAreaLight);
        }

        if (showSkeleton !== app.storage.get('showSkeleton')) {
            app.storage.set('showSkeleton', showSkeleton);
            app.call(`storageChanged`, this, 'showSkeleton', showSkeleton);
        }

        this.handleUpdate();
    }
}

export default HelperPanel;