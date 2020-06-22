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
import ItemIcon from '../util/KmlItemIcon';
import KmlElements from '../KmlElements';
import KmlSubStyle from './KmlSubStyle';
import NodeTransformers from '../util/KmlNodeTransformers';
    
    /**
     * Constructs an KmlListStyle. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlListStyle
     * @classdesc Contains the data associated with ListStyle node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing list style in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#liststyle
     * @augments KmlSubStyle
     */
    var KmlListStyle = function (options) {
        KmlSubStyle.call(this, options);
    };

    KmlListStyle.prototype = Object.create(KmlSubStyle.prototype);

    Object.defineProperties(KmlListStyle.prototype, {
        /**
         * Background color for the Snippet. Color and opacity values are expressed in hexadecimal notation. The
         * range of values for any one color is 0 to 255 (00 to ff). For alpha, 00 is fully transparent and ff is
         * fully opaque. The order of expression is aabbggrr, where aa=alpha (00 to ff); bb=blue (00 to ff);
         * gg=green (00 to ff); rr=red (00 to ff). For example, if you want to apply a blue color with 50 percent
         * opacity to an overlay, you would specify the following: &lt;color&gt;7fff0000&lt;/color&gt;, where alpha=0x7f,
         * blue=0xff, green=0x00, and red=0x00.
         * @memberof KmlListStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlBgColor: {
            get: function () {
                return this._factory.specific(this, {name: 'bgColor', transformer: NodeTransformers.string});
            }
        },

        /**
         * Specifies how a Feature is displayed in the list view. Possible values are:
         * check (default) - The Feature's visibility is tied to its item's checkbox.
         * radioFolder - When specified for a Container, only one of the Container's items is visible at a time
         * checkOffOnly - When specified for a Container or Network Link, prevents all items from being made
         * visible
         *  at once that is, the user can turn everything in the Container or Network Link off but cannot turn
         * everything on at the same time. This setting is useful for Containers or Network Links containing large
         * amounts of data. checkHideChildren - Use a normal checkbox for visibility but do not display the
         * Container or Network Link's children in the list view. A checkbox allows the user to toggle visibility
         * of the child objects in the viewer.
         * @memberof KmlListStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlListItemType: {
            get: function () {
                return this._factory.specific(this, {name: 'listItemType', transformer: NodeTransformers.string});
            }
        },

        /**
         * Icon used in the List view that reflects the state of a Folder or Link fetch. Icons associated with the
         * open and closed modes are used for Folders and Network Links. Icons associated with the error and
         * fetching0, fetching1, and fetching2 modes are used for Network Links.
         * @memberof KmlListStyle.prototype
         * @readonly
         * @type {ItemIcon}
         */
        kmlItemIcon: {
            get: function () {
                return this._factory.any(this, {
                    name: ItemIcon.prototype.getTagNames()
                });
            }
        }
    });

    KmlListStyle.update = function() {

    };

    /**
     * @inheritDoc
     */
    KmlListStyle.prototype.getTagNames = function () {
        return ['ListStyle'];
    };

    KmlElements.addKey(KmlListStyle.prototype.getTagNames()[0], KmlListStyle);

    export default KmlListStyle;

