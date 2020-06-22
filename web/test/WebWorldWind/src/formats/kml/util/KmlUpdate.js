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
import Change from './KmlChange';
import Create from './KmlCreate';
import Delete from './KmlDelete';
import KmlElements from '../KmlElements';
import KmlObject from '../KmlObject';
import NodeTransformers from './KmlNodeTransformers';
	var KmlUpdate = function(options) {
		KmlObject.call(this, options);
	};

	KmlUpdate.prototype = Object.create(KmlObject.prototype);

	Object.defineProperties(KmlUpdate.prototype, {
		/**
		 * A URL that specifies the .kml or .kmz file whose data (within Google Earth) is to be modified by an <KmlUpdate> element. This KML file must already have been loaded via a <NetworkLink>. In that file, the element to be modified must already have an explicit id attribute defined for it.
		 * @memberof KmlUpdate.prototype
		 * @readonly
		 * @type {String}
		 */
		targetHref: {
			get: function() {
				return this._factory.specific(this, {name: 'minRefreshPeriod', transformer: NodeTransformers.number});
			}
		},

		/**
		 * Modifies the values in an element that has already been loaded with a <NetworkLink>. Within the Change element, the child to be modified must include a targetId attribute that references the original element's id.
		 This update can be considered a "sparse update": in the modified element, only the values listed in <Change> are replaced; all other values remained untouched. When <Change> is applied to a set of coordinates, the new coordinates replace the current coordinates.
		 Children of this element are the element(s) to be modified, which are identified by the targetId attribute.
		 * @memberof KmlUpdate.prototype
		 * @readonly
		 * @type {Change}
		 */
		Change: {
			get: function() {
				return this._factory.any(this, {
					name: Change.prototype.getTagNames()
				});
			}
		},

		/**
		 * Adds new elements to a Folder or Document that has already been loaded via a <NetworkLink>. The <targetHref> element in <KmlUpdate> specifies the URL of the .kml or .kmz file that contained the original Folder or Document. Within that file, the Folder or Document that is to contain the new data must already have an explicit id defined for it. This id is referenced as the targetId attribute of the Folder or Document within <Create> that contains the element to be added.
		 Once an object has been created and loaded into Google Earth, it takes on the URL of the original parent Document of Folder. To perform subsequent updates to objects added with this KmlUpdate/Create mechanism, set <targetHref> to the URL of the original Document or Folder (not the URL of the file that loaded the intervening updates).
		 * @memberof KmlUpdate.prototype
		 * @readonly
		 * @type {Create}
		 */
		Create: {
			get: function() {
				return this._factory.any(this, {
					name: Create.prototype.getTagNames()
				});
			}
		},

		/**
		 * Deletes features from a complex element that has already been loaded via a <NetworkLink>. The <targetHref> element in <KmlUpdate> specifies the .kml or .kmz file containing the data to be deleted. Within that file, the element to be deleted must already have an explicit id defined for it. The <Delete> element references this id in the targetId attribute.
		 Child elements for <Delete>, which are the only elements that can be deleted, are Document, Folder, GroundOverlay, Placemark, and ScreenOverlay.
		 * @memberof KmlUpdate.prototype
		 * @readonly
		 * @type {Delete}
		 */
		Delete: {
			get: function() {
				return this._factory.any(this, {
					name: Delete.prototype.getTagNames()
				});
			}
		}
	});

	/**
	 * @inheritDoc
	 */
	KmlUpdate.prototype.getTagNames = function() {
		return ['Update'];
	};

	KmlElements.addKey(KmlUpdate.prototype.getTagNames()[0], KmlUpdate);

	export default KmlUpdate;
