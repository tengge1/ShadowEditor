/**
 * @author mrdoob / http://mrdoob.com/
 */

function FileMenu(editor) {

    var NUMBER_PRECISION = 6;

    function parseNumber(key, value) {

        return typeof value === 'number' ? parseFloat(value.toFixed(NUMBER_PRECISION)) : value;

    }

    //

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('文件');
    container.add(title);

    var options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    // New

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('新建');
    option.onClick(function () {

        if (confirm('所有未保存数据将丢失，确定吗？')) {

            editor.clear();

        }

    });
    options.add(option);

    //

    options.add(new UI.HorizontalRule());

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
    option.setTextContent('导出几何体');
    option.onClick(function () {

        var object = editor.selected;

        if (object === null) {

            alert('请选择物体');
            return;

        }

        var geometry = object.geometry;

        if (geometry === undefined) {

            alert('选中的对象不具有几何属性。');
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
    option.setTextContent('导出对象');
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

    options.add(new UI.HorizontalRule());

    // Publish

    var option = new UI.Row();
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

    /*
	// Publish (Dropbox)

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Publish (Dropbox)' );
	option.onClick( function () {

		var parameters = {
			files: [
				{ 'url': 'data:text/plain;base64,' + window.btoa( "Hello, World" ), 'filename': 'app/test.txt' }
			]
		};

		Dropbox.save( parameters );

	} );
	options.add( option );
	*/


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