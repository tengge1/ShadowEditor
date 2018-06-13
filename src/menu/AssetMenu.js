import UI from '../ui/UI';

function AssetMenu(editor) {

    var NUMBER_PRECISION = 6;

    function parseNumber(key, value) {

        return typeof value === 'number' ? parseFloat(value.toFixed(NUMBER_PRECISION)) : value;

    }

    //

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('资源');
    container.add(title);

    var options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    // Import

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', function (event) {

        editor.loader.loadFile(fileInput.files[0]);

    });

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导入');
    option.onClick(function () {

        fileInput.click();

    });
    options.add(option);

    //

    options.add(new UI.HorizontalRule());

    // Export Geometry

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出Geometry');
    option.onClick(function () {

        var object = editor.selected;

        if (object === null) {

            alert('请选择物体');
            return;

        }

        var geometry = object.geometry;

        if (geometry === undefined) {

            alert('选中的对象不具有Geometry属性。');
            return;

        }

        var output = geometry.toJSON();

        try {

            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            output = JSON.stringify(output);

        }

        saveString(output, 'geometry.json');

    });
    options.add(option);

    // Export Object

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出Object');
    option.onClick(function () {

        var object = editor.selected;

        if (object === null) {

            alert('请选择对象');
            return;

        }

        var output = object.toJSON();

        try {

            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            output = JSON.stringify(output);

        }

        saveString(output, 'model.json');

    });
    options.add(option);

    // Export Scene

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出场景');
    option.onClick(function () {

        var output = editor.scene.toJSON();

        try {

            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            output = JSON.stringify(output);

        }

        saveString(output, 'scene.json');

    });
    options.add(option);

    // Export OBJ

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出OBJ');
    option.onClick(function () {

        var object = editor.selected;

        if (object === null) {

            alert('请选择对象');
            return;

        }

        var exporter = new THREE.OBJExporter();

        saveString(exporter.parse(object), 'model.obj');

    });
    options.add(option);

    // Export STL

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出STL');
    option.onClick(function () {

        var exporter = new THREE.STLExporter();

        saveString(exporter.parse(editor.scene), 'model.stl');

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

export default AssetMenu;