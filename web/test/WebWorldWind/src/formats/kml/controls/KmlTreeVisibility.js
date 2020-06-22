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
import WWUtil from '../../../util/WWUtil';
import KmlControls from './KmlControls';
    

    /**
     * This class represents the structure of Documents, Folders and Features in the document. It renders them into
     * some of the outside area with defined classes, so that user can specify the look and feel.
     * Important part of this effort is to allow user show/hide subset of the Features present in the document.
     * Implementing this functionality also simplifies the manual testing.
     * @param visualElementId {String} Id of the element into which this will be rendered.
     * @param wwd {WorldWindow} WorldWindow instance necessary to control the redraw in the framework.
     * @constructor
     * @augments KmlControls
     * @alias KmlTreeVisibility
     * @classdesc Class for controlling the visibility of features.
     */
    var KmlTreeVisibility = function (visualElementId, wwd) {
        KmlControls.apply(this);

        this._visualElementId = visualElementId;
        this._wwd = wwd;
    };

    KmlTreeVisibility.prototype = Object.create(KmlControls.prototype);

    /**
     * @inheritDoc
     */
    KmlTreeVisibility.prototype.hook = function (node, options) {
        if(options.isFeature) {
            this.createControls(node);
        }
    };

    // For internal use only.
    KmlTreeVisibility.prototype.createControls = function (node) {
        var name = node.kmlName || node.id || WWUtil.guid();
        var enabled = node.enabled && node.kmlVisibility === true;

        var controlsForSingleElement = document.createElement("div");

        var toggleVisibility = document.createElement("input");
        toggleVisibility.setAttribute("type", "checkbox");
        if (enabled) {
            toggleVisibility.setAttribute("checked", "checked");
        }
        toggleVisibility.addEventListener("click", toggleVisibilityOfElement, true);

        controlsForSingleElement.appendChild(toggleVisibility);

        var lookAtName;
        if (node.kmlAbstractView) {
            lookAtName = document.createElement("a");
        } else {
            lookAtName = document.createElement("span");
        }
        lookAtName.appendChild(document.createTextNode(name));
        lookAtName.addEventListener("click", lookAt, true);

        controlsForSingleElement.appendChild(lookAtName);

        document.getElementById(this._visualElementId).appendChild(controlsForSingleElement);

        var self = this;

        function toggleVisibilityOfElement() {
            enabled = !enabled;
            self.updateDescendants(node, enabled);
        }

        function lookAt() {
            if (node.kmlAbstractView) {
                node.kmlAbstractView.update({wwd: self._wwd});
            }
        }
    };

    // Internal use only. Updates all descendants of given Feature.
    KmlTreeVisibility.prototype.updateDescendants = function (node, enabled) {
        node.controlledVisibility = enabled;
        this._wwd.redraw();
    };

    export default KmlTreeVisibility;
