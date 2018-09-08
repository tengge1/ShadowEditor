import UI from '../../../ui/UI';
import ObjectPanel from './ObjectPanel';
import GeometryPanel from './GeometryPanel';
import MaterialPanel from './MaterialPanel';
import BasicComponent from '../../../component/BasicComponent';
import TransformComponent from '../../../component/TransformComponent';
import CameraComponent from '../../../component/CameraComponent';

/**
 * 属性面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function PropertyPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

PropertyPanel.prototype = Object.create(UI.Control.prototype);
PropertyPanel.prototype.constructor = PropertyPanel;

PropertyPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        children: [
            new BasicComponent({ app: this.app }),
            new TransformComponent({ app: this.app }),
            new CameraComponent({ app: this.app }),
            {
                xtype: 'div',
                id: 'objectPanel',
                scope: this.id,
                children: [
                    new ObjectPanel({ app: this.app })
                ]
            }, { // 几何面板
                xtype: 'div',
                id: 'geometryPanel',
                scope: this.id,
                children: [
                    new GeometryPanel({ app: this.app })
                ]
            }, { // 材质面板
                xtype: 'div',
                id: 'materialPanel',
                scope: this.id,
                children: [
                    new MaterialPanel({ app: this.app })
                ]
            }]
    };

    var control = UI.create(data);
    control.render();
};

export default PropertyPanel;