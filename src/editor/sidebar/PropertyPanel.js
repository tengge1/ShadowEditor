import ObjectPanel from './ObjectPanel';
import GeometryPanel from './geometry/GeometryPanel';
import MaterialPanel from './MaterialPanel';
import UI from '../../ui/UI';

/**
 * 属性面板
 * @author mrdoob / http://mrdoob.com/
 */
function PropertyPanel(app) {
    this.app = app;
    var editor = this.app.editor;

    var container = new UI.Span();

    var objectTab = new UI.Text({
        text: '物体',
        onClick: onClick
    });

    var geometryTab = new UI.Text({
        text: '几何',
        onClick: onClick
    });

    var materialTab = new UI.Text({
        text: '材质',
        onClick: onClick
    });

    var tabs = new UI.Div({
        id: 'tabs'
    });

    tabs.add(objectTab);
    tabs.add(geometryTab);
    tabs.add(materialTab);

    container.add(tabs);

    function onClick(event) {
        select(event.target.textContent);
    }

    container.render();

    //

    var object = new UI.Span();

    object.render();

    var objectPanel = new ObjectPanel(this.app);
    object.dom.appendChild(objectPanel.dom);

    container.dom.appendChild(object.dom);

    var geometry = new UI.Span();
    geometry.render();

    var geometryPanel = new GeometryPanel(editor);

    geometry.dom.appendChild(geometryPanel.dom);

    container.dom.appendChild(geometry.dom);

    var material = new UI.Span();

    material.render();

    var materialPanel = new MaterialPanel(this.app);

    material.dom.appendChild(materialPanel.dom);

    container.dom.appendChild(material.dom);

    //

    function select(section) {

        objectTab.dom.className = '';
        geometryTab.dom.className = '';
        materialTab.dom.className = '';

        object.dom.style.display = 'none';
        geometry.dom.style.display = 'none';
        material.dom.style.display = 'none';

        switch (section) {
            case '物体':
                objectTab.dom.className = 'selected';
                object.dom.style.display = '';
                break;
            case '几何':
                geometryTab.dom.className = 'selected';
                geometry.dom.style.display = '';
                break;
            case '材质':
                materialTab.dom.className = 'selected';
                material.dom.style.display = '';
                break;
        }

    }

    select('物体');

    return container;
};

export default PropertyPanel;