/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Examples = function (editor) {

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('示例');
    container.add(title);

    var options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    // Examples

    var items = [
		{ title: '打砖块', file: 'arkanoid.app.json' },
		{ title: '相机', file: 'camera.app.json' },
		{ title: '粒子', file: 'particles.app.json' },
		{ title: '乒乓球', file: 'pong.app.json' }
    ];

    var loader = new THREE.FileLoader();

    for (var i = 0; i < items.length; i++) {

        (function (i) {

            var item = items[i];

            var option = new UI.Row();
            option.setClass('option');
            option.setTextContent(item.title);
            option.onClick(function () {

                if (confirm('任何未保存数据将丢失。确定吗？')) {

                    loader.load('examples/' + item.file, function (text) {

                        editor.clear();
                        editor.fromJSON(JSON.parse(text));

                    });

                }

            });
            options.add(option);

        })(i)

    }

    return container;

};
