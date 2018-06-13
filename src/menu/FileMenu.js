import Panel from '../ui/Panel';
import Row from '../ui/Row';
import HorizontalRule from '../ui/HorizontalRule';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function FileMenu(editor) {

    var container = new Panel();
    container.setClass('menu');

    var title = new Panel();
    title.setClass('title');
    title.setTextContent('文件');
    container.add(title);

    var options = new Panel();
    options.setClass('options');
    container.add(options);

    // 新建

    var option = new Row();
    option.setClass('option');
    option.setTextContent('新建');
    option.onClick(function () {

        if (confirm('所有未保存数据将丢失，确定吗？')) {

            editor.clear();

        }

    });
    options.add(option);

    // 载入

    var option = new Row();
    option.setClass('option');
    option.setTextContent('载入');
    option.onClick(function () {

        if (confirm('所有未保存数据将丢失，确定吗？')) {

            editor.load();

        }

    });
    options.add(option);

    // 保存

    var option = new Row();
    option.setClass('option');
    option.setTextContent('保存');
    option.onClick(function () {

        editor.save();

    });
    options.add(option);

    // ---

    options.add(new HorizontalRule());

    // 发布

    var option = new Row();
    option.setClass('option');
    option.setTextContent('发布');
    option.onClick(function () {

        var zip = new JSZip();

        //

        var output = editor.toJSON();
        output.metadata.type = 'App';
        delete output.history;

        var vr = output.project.vr;

        output = JSON.stringify(output, parseNumber, '\t');
        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        zip.file('app.json', output);

        //

        var manager = new THREE.LoadingManager(function () {

            save(zip.generate({ type: 'blob' }), 'download.zip');

        });

        var loader = new THREE.FileLoader(manager);
        loader.load('js/libs/app/index.html', function (content) {

            var includes = [];

            if (vr) {

                includes.push('<script src="js/VRControls.js"></script>');
                includes.push('<script src="js/VREffect.js"></script>');
                includes.push('<script src="js/WebVR.js"></script>');

            }

            content = content.replace('<!-- includes -->', includes.join('\n\t\t'));

            zip.file('index.html', content);

        });
        loader.load('js/libs/app.js', function (content) {

            zip.file('js/app.js', content);

        });
        loader.load('../build/three.min.js', function (content) {

            zip.file('js/three.min.js', content);

        });

        if (vr) {

            loader.load('../js/controls/VRControls.js', function (content) {

                zip.file('js/VRControls.js', content);

            });

            loader.load('../js/effects/VREffect.js', function (content) {

                zip.file('js/VREffect.js', content);

            });

            loader.load('../js/WebVR.js', function (content) {

                zip.file('js/WebVR.js', content);

            });

        }

    });
    options.add(option);

    //

    var link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594

    function save(blob, filename) {

        link.href = URL.createObjectURL(blob);
        link.download = filename || 'data.json';
        link.click();

        // URL.revokeObjectURL( url ); breaks Firefox...

    }

    function saveString(text, filename) {

        save(new Blob([text], { type: 'text/plain' }), filename);

    }

    return container;

};

export default FileMenu;