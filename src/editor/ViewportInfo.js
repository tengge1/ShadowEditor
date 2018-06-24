import UI2 from '../ui2/UI';

/**
 * 场景信息面板
 * @author mrdoob / http://mrdoob.com/
 */
function ViewportInfo(app, container) {
    var container = new UI2.Div({
        parent: container.dom,
        style: 'position: absolute; left: 10px; bottom: 10px; font-size: 12px; color: #fff;'
    });

    // 物体数
    container.add(new UI2.Text({ text: '物体' }));
    container.add(new UI2.Text({
        id: 'objectsText',
        text: '0',
        style: 'margin-left: 6px'
    }));
    container.add(new UI2.Break());

    // 顶点数
    container.add(new UI2.Text({ text: '顶点' }));
    container.add(new UI2.Text({
        id: 'verticesText',
        text: '0',
        style: 'margin-left: 6px'
    }));
    container.add(new UI2.Break());

    // 三角形数
    container.add(new UI2.Text({ text: '三角形' }));
    container.add(new UI2.Text({
        id: 'trianglesText',
        text: '0',
        style: 'margin-left: 6px'
    }));
    container.add(new UI2.Break());

    container.render();
};

export default ViewportInfo;