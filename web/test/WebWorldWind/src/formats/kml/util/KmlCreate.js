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
import KmlElements from '../KmlElements';
import KmlObject from '../KmlObject';
	/**
	 *
	 * @param options {Object}
	 * @augments KmlObject
	 * @constructor
	 * @alias KmlCreate
	 */
	var KmlCreate = function(options) {
		KmlObject.call(this, options);
	};

	KmlCreate.prototype = Object.create(KmlObject.prototype);
	
	Object.defineProperties(KmlCreate.prototype, {
		/**
		 * All shapes which should be created with the location where they should be created.
		 * @memberof KmlCreate.prototype
		 * @readonly
		 * @type {KmlObject[]}
		 */
		shapes: {
			get: function(){
				return this._factory.all(this);
			}
		}
	});

	/**
	 * @inheritDoc
	 */
	KmlCreate.prototype.getTagNames = function() {
		return ['Create'];
	};
	
	KmlElements.addKey(KmlCreate.prototype.getTagNames()[0], KmlCreate);

	export default KmlCreate;
