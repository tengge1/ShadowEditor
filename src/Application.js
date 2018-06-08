window.URL = window.URL || window.webkitURL;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

Number.prototype.format = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

//

var editor = new Editor();

var viewport = new Viewport(editor);
document.body.appendChild(viewport.dom);

var script = new Script(editor);
document.body.appendChild(script.dom);

var player = new Player(editor);
document.body.appendChild(player.dom);

var toolbar = new Toolbar(editor);
document.body.appendChild(toolbar.dom);

var menubar = new Menubar(editor);
document.body.appendChild(menubar.dom);

var sidebar = new Sidebar(editor);
document.body.appendChild(sidebar.dom);

var modal = new UI.Modal();
document.body.appendChild(modal.dom);

//

editor.setTheme(editor.config.getKey('theme'));

editor.storage.init(function () {

    editor.storage.get(function (state) {

        if (isLoadingFromHash) return;

        if (state !== undefined) {

            editor.fromJSON(state);

        }

        var selected = editor.config.getKey('selected');

        if (selected !== undefined) {

            editor.selectByUuid(selected);

        }

    });

    //

    var timeout;

    function saveState(scene) {

        if (editor.config.getKey('autosave') === false) {

            return;

        }

        clearTimeout(timeout);

        timeout = setTimeout(function () {

            editor.signals.savingStarted.dispatch();

            timeout = setTimeout(function () {

                editor.storage.set(editor.toJSON());

                editor.signals.savingFinished.dispatch();

            }, 100);

        }, 1000);

    };

    var signals = editor.signals;

    signals.geometryChanged.add(saveState);
    signals.objectAdded.add(saveState);
    signals.objectChanged.add(saveState);
    signals.objectRemoved.add(saveState);
    signals.materialChanged.add(saveState);
    signals.sceneBackgroundChanged.add(saveState);
    signals.sceneFogChanged.add(saveState);
    signals.sceneGraphChanged.add(saveState);
    signals.scriptChanged.add(saveState);
    signals.historyChanged.add(saveState);

    signals.showModal.add(function (content) {

        modal.show(content);

    });

});

//

document.addEventListener('dragover', function (event) {

    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

}, false);

document.addEventListener('drop', function (event) {

    event.preventDefault();

    if (event.dataTransfer.files.length > 0) {

        editor.loader.loadFile(event.dataTransfer.files[0]);

    }

}, false);

document.addEventListener('keydown', function (event) {

    switch (event.keyCode) {

        case 8: // backspace

            event.preventDefault(); // prevent browser back

        case 46: // delete

            var object = editor.selected;

            if (confirm('Delete ' + object.name + '?') === false) return;

            var parent = object.parent;
            if (parent !== null) editor.execute(new RemoveObjectCommand(object));

            break;

        case 90: // Register Ctrl-Z for Undo, Ctrl-Shift-Z for Redo

            if (event.ctrlKey && event.shiftKey) {

                editor.redo();

            } else if (event.ctrlKey) {

                editor.undo();

            }

            break;

        case 87: // Register W for translation transform mode

            editor.signals.transformModeChanged.dispatch('translate');

            break;

        case 69: // Register E for rotation transform mode

            editor.signals.transformModeChanged.dispatch('rotate');

            break;

        case 82: // Register R for scaling transform mode

            editor.signals.transformModeChanged.dispatch('scale');

            break;

    }

}, false);

function onWindowResize(event) {

    editor.signals.windowResize.dispatch();

}

window.addEventListener('resize', onWindowResize, false);

onWindowResize();

//

var isLoadingFromHash = false;
var hash = window.location.hash;

if (hash.substr(1, 5) === 'file=') {

    var file = hash.substr(6);

    if (confirm('未保存数据将丢失。确定吗？')) {

        var loader = new THREE.FileLoader();
        loader.crossOrigin = '';
        loader.load(file, function (text) {

            editor.clear();
            editor.fromJSON(JSON.parse(text));

        });

        isLoadingFromHash = true;

    }

}

/*
window.addEventListener( 'message', function ( event ) {

    editor.clear();
    editor.fromJSON( event.data );

}, false );
*/

// VR

var groupVR;

// TODO: Use editor.signals.enteredVR (WebVR 1.0)

editor.signals.enterVR.add(function () {

    if (groupVR === undefined) {

        groupVR = new THREE.HTMLGroup(viewport.dom);
        editor.sceneHelpers.add(groupVR);

        var mesh = new THREE.HTMLMesh(sidebar.dom);
        mesh.position.set(15, 0, 15);
        mesh.rotation.y = -0.5;
        groupVR.add(mesh);

        var signals = editor.signals;

        function updateTexture() {

            mesh.material.map.update();

        }

        signals.objectSelected.add(updateTexture);
        signals.objectAdded.add(updateTexture);
        signals.objectChanged.add(updateTexture);
        signals.objectRemoved.add(updateTexture);
        signals.sceneGraphChanged.add(updateTexture);
        signals.historyChanged.add(updateTexture);

    }

    groupVR.visible = true;

});

editor.signals.exitedVR.add(function () {

    if (groupVR !== undefined) groupVR.visible = false;

});