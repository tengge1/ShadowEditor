import Element from './Element';

// Outliner

function Outliner(editor) {

    Element.call(this);

    var scope = this;

    var dom = document.createElement('div');
    dom.className = 'Outliner';
    dom.tabIndex = 0;	// keyup event is ignored without setting tabIndex

    // hack
    this.scene = editor.scene;

    // Prevent native scroll behavior
    dom.addEventListener('keydown', function (event) {

        switch (event.keyCode) {
            case 38: // up
            case 40: // down
                event.preventDefault();
                event.stopPropagation();
                break;
        }

    }, false);

    // Keybindings to support arrow navigation
    dom.addEventListener('keyup', function (event) {

        switch (event.keyCode) {
            case 38: // up
                scope.selectIndex(scope.selectedIndex - 1);
                break;
            case 40: // down
                scope.selectIndex(scope.selectedIndex + 1);
                break;
        }

    }, false);

    this.dom = dom;

    this.options = [];
    this.selectedIndex = - 1;
    this.selectedValue = null;

    return this;

};

Outliner.prototype = Object.create(Element.prototype);
Outliner.prototype.constructor = Outliner;

Outliner.prototype.selectIndex = function (index) {

    if (index >= 0 && index < this.options.length) {

        this.setValue(this.options[index].value);

        var changeEvent = document.createEvent('HTMLEvents');
        changeEvent.initEvent('change', true, true);
        this.dom.dispatchEvent(changeEvent);

    }

};

Outliner.prototype.setOptions = function (options) {

    var scope = this;

    while (scope.dom.children.length > 0) {

        scope.dom.removeChild(scope.dom.firstChild);

    }

    function onClick() {

        scope.setValue(this.value);

        var changeEvent = document.createEvent('HTMLEvents');
        changeEvent.initEvent('change', true, true);
        scope.dom.dispatchEvent(changeEvent);

    }

    // Drag

    var currentDrag;

    function onDrag(event) {

        currentDrag = this;

    }

    function onDragStart(event) {

        event.dataTransfer.setData('text', 'foo');

    }

    function onDragOver(event) {

        if (this === currentDrag) return;

        var area = event.offsetY / this.clientHeight;

        if (area < 0.25) {

            this.className = 'option dragTop';

        } else if (area > 0.75) {

            this.className = 'option dragBottom';

        } else {

            this.className = 'option drag';

        }

    }

    function onDragLeave() {

        if (this === currentDrag) return;

        this.className = 'option';

    }

    function onDrop(event) {

        if (this === currentDrag) return;

        this.className = 'option';

        var scene = scope.scene;
        var object = scene.getObjectById(currentDrag.value);

        var area = event.offsetY / this.clientHeight;

        if (area < 0.25) {

            var nextObject = scene.getObjectById(this.value);
            moveObject(object, nextObject.parent, nextObject);

        } else if (area > 0.75) {

            var nextObject = scene.getObjectById(this.nextSibling.value);
            moveObject(object, nextObject.parent, nextObject);

        } else {

            var parentObject = scene.getObjectById(this.value);
            moveObject(object, parentObject);

        }

    }

    function moveObject(object, newParent, nextObject) {

        if (nextObject === null) nextObject = undefined;

        var newParentIsChild = false;

        object.traverse(function (child) {

            if (child === newParent) newParentIsChild = true;

        });

        if (newParentIsChild) return;

        editor.execute(new MoveObjectCommand(object, newParent, nextObject));

        var changeEvent = document.createEvent('HTMLEvents');
        changeEvent.initEvent('change', true, true);
        scope.dom.dispatchEvent(changeEvent);

    }

    //

    scope.options = [];

    for (var i = 0; i < options.length; i++) {

        var div = options[i];
        div.className = 'option';
        scope.dom.appendChild(div);

        scope.options.push(div);

        div.addEventListener('click', onClick, false);

        if (div.draggable === true) {

            div.addEventListener('drag', onDrag, false);
            div.addEventListener('dragstart', onDragStart, false); // Firefox needs this

            div.addEventListener('dragover', onDragOver, false);
            div.addEventListener('dragleave', onDragLeave, false);
            div.addEventListener('drop', onDrop, false);

        }


    }

    return scope;

};

Outliner.prototype.getValue = function () {

    return this.selectedValue;

};

Outliner.prototype.setValue = function (value) {

    for (var i = 0; i < this.options.length; i++) {

        var element = this.options[i];

        if (element.value === value) {

            element.classList.add('active');

            // scroll into view

            var y = element.offsetTop - this.dom.offsetTop;
            var bottomY = y + element.offsetHeight;
            var minScroll = bottomY - this.dom.offsetHeight;

            if (this.dom.scrollTop > y) {

                this.dom.scrollTop = y;

            } else if (this.dom.scrollTop < minScroll) {

                this.dom.scrollTop = minScroll;

            }

            this.selectedIndex = i;

        } else {

            element.classList.remove('active');

        }

    }

    this.selectedValue = value;

    return this;

};

export default Outliner;