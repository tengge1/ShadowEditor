/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports PickedObjectList
 */



/**
 * Constructs a picked-object list.
 * @alias PickedObjectList
 * @constructor
 * @classdesc Holds a collection of picked objects.
 */
function PickedObjectList() {
    /**
     * The picked objects.
     * @type {Array}
     */
    this.objects = [];
}

/**
 * Indicates whether this list contains picked objects that are not terrain.
 * @returns {Boolean} true if this list contains objects that are not terrain,
 * otherwise false.
 */
PickedObjectList.prototype.hasNonTerrainObjects = function () {
    return this.objects.length > 1 || this.objects.length === 1 && this.terrainObject() == null;
};

/**
 * Returns the terrain object within this list, if this list contains a terrain object.
 * @returns {PickedObject} The terrain object, or null if this list does not contain a terrain object.
 */
PickedObjectList.prototype.terrainObject = function () {
    for (var i = 0, len = this.objects.length; i < len; i++) {
        if (this.objects[i].isTerrain) {
            return this.objects[i];
        }
    }

    return null;
};

/**
 * Adds a picked object to this list.
 * If the picked object is a terrain object and the list already contains a terrain object, the terrain
 * object in the list is replaced by the specified one.
 * @param {PickedObject} pickedObject The picked object to add. If null, this list remains unchanged.
 */
PickedObjectList.prototype.add = function (pickedObject) {
    if (pickedObject) {
        if (pickedObject.isTerrain) {
            var terrainObjectIndex = this.objects.length;

            for (var i = 0, len = this.objects.length; i < len; i++) {
                if (this.objects[i].isTerrain) {
                    terrainObjectIndex = i;
                    break;
                }
            }

            this.objects[terrainObjectIndex] = pickedObject;
        } else {
            this.objects.push(pickedObject);
        }
    }
};

/**
 * Removes all items from this list.
 */
PickedObjectList.prototype.clear = function () {
    this.objects = [];
};

/**
 * Returns the top-most picked object in this list.
 * @returns {PickedObject} The top-most picked object in this list, or null if this list is empty.
 */
PickedObjectList.prototype.topPickedObject = function () {
    var size = this.objects.length;

    if (size > 1) {
        for (var i = 0; i < size; i++) {
            if (this.objects[i].isOnTop) {
                return this.objects[i];
            }
        }
    }

    if (size > 0) {
        return this.objects[0];
    }

    return null;
};

export default PickedObjectList;
