import UI2 from '../ui2/UI';

/**
 * 场景信息面板
 * @author mrdoob / http://mrdoob.com/
 */
function ViewportInfo(app, container) {
    this.parent = container;

    this.container = new UI2.Div({
        parent: this.parent.dom,
        style: 'position: absolute; left: 10px; bottom: 10px; font-size: 12px; color: #fff;'
    });

    // 物体数
    this.objectsLabel = new UI2.Text({ text: '物体' });
    this.objectsText = new UI2.Text({
        id: 'objectsText',
        text: '0',
        style: 'margin-left: 6px'
    });

    this.container.add(this.objectsLabel);
    this.container.add(this.objectsText);
    this.container.add(new UI2.Break());

    // 顶点数
    this.verticesLabel = new UI2.Text({ text: '顶点' });
    this.verticesText = new UI2.Text({
        id: 'verticesText',
        text: '0',
        style: 'margin-left: 6px'
    });

    this.container.add(this.verticesLabel);
    this.container.add(this.verticesText);
    this.container.add(new UI2.Break());

    // 三角形数
    this.trianglesLabel = new UI2.Text({ text: '三角形' });
    this.trianglesText = new UI2.Text({
        id: 'trianglesText',
        text: '0',
        style: 'margin-left: 6px'
    });
    this.container.add(this.trianglesLabel);
    this.container.add(this.trianglesText);
    this.container.add(new UI2.Break());

    this.container.render();
};

export default ViewportInfo;