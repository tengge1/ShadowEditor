import Control from './Control';
import MoveObjectCommand from '../command/MoveObjectCommand';

/**
 * 大纲控件
 * @param {*} options 
 */
function Outliner(options) {
    Control.call(this, options);
    options = options || {};

    this.editor = options.editor || null;
    this.onChange = options.onChange || null;
    this.onDblClick = options.onDblClick || null;
}

Outliner.prototype = Object.create(Control.prototype);
Outliner.prototype.constructor = Outliner;

Outliner.prototype.render = function () {
    this.dom = document.createElement('div');

    this.dom.className = 'Outliner';
    this.dom.tabIndex = 0;	// keyup event is ignored without setting tabIndex

    // hack
    this.scene = this.editor.scene;

    // Prevent native scroll behavior
    this.dom.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 40: // down
                event.preventDefault();
                event.stopPropagation();
                break;
        }

    }, false);

    var _this = this;

    // Keybindings to support arrow navigation
    this.dom.addEventListener('keyup', function (event) {
        switch (event.keyCode) {
            case 38: // up
                _this.selectIndex(scope.selectedIndex - 1);
                break;
            case 40: // down
                _this.selectIndex(scope.selectedIndex + 1);
                break;
        }

    }, false);

    this.parent.appendChild(this.dom);

    if (this.onChange) {
        this.dom.addEventListener('change', this.onChange.bind(this));
    }

    if (this.onDblClick) {
        this.dom.addEventListener('dblclick', this.onDblClick.bind(this));
    }

    this.options = [];
    this.selectedIndex = - 1;
    this.selectedValue = null;
};

Outliner.prototype.selectIndex = function (index) {
    if (index >= 0 && index < this.options.length) {
        this.setValue(this.options[index].value);

        var changeEvent = document.createEvent('HTMLEvents');
        changeEvent.initEvent('change', true, true);
        this.dom.dispatchEvent(changeEvent);
    }
};

Outliner.prototype.setOptions = function (options) {
    var _this = this;

    while (this.dom.children.length > 0) {
        this.dom.removeChild(this.dom.firstChild);
    }

    function onClick() {
        _this.setValue(this.value);

        var changeEvent = document.createEvent('HTMLEvents');
        changeEvent.initEvent('change', true, true);
        _this.dom.dispatchEvent(changeEvent);
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
        if (this === currentDrag) {
            return;
        }

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
        if (this === currentDrag) {
            return;
        }

        this.className = 'option';
    }

    function onDrop(event) {
        if (this === currentDrag) {
            return;
        }

        this.className = 'option';

        var scene = _this.scene;
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

        _this.editor.execute(new MoveObjectCommand(object, newParent, nextObject));

        var changeEvent = document.createEvent('HTMLEvents');
        changeEvent.initEvent('change', true, true);
        _this.dom.dispatchEvent(changeEvent);
    }

    //
    _this.options = [];

    for (var i = 0; i < options.length; i++) {
        var div = options[i];
        div.className = 'option';
        _this.dom.appendChild(div);

        _this.options.push(div);

        div.addEventListener('click', onClick, false);

        if (div.draggable === true) {
            div.addEventListener('drag', onDrag, false);
            div.addEventListener('dragstart', onDragStart, false); // Firefox needs this

            div.addEventListener('dragover', onDragOver, false);
            div.addEventListener('dragleave', onDragLeave, false);
            div.addEventListener('drop', onDrop, false);
        }
    }

    return _this;
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