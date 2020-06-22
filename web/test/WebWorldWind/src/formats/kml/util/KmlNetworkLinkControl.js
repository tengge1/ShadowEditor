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
import KmlAbstractView from '../KmlAbstractView';
import KmlElements from '../KmlElements';
import KmlObject from '../KmlObject';
import NodeTransformers from './KmlNodeTransformers';
import Update from './KmlUpdate';
	/**
	 * Controls the behavior of files fetched by a <NetworkLink>. It is direct descendant of kml and there should always
     * be maximum one per document.
	 * @alias KmlNetworkLinkControl
	 * @constructor
	 * @augments KmlObject
	 */
	var KmlNetworkLinkControl = function(options) {
		KmlObject.call(this, options);
	};

	KmlNetworkLinkControl.prototype = Object.create(KmlObject.prototype);

	Object.defineProperties(KmlNetworkLinkControl.prototype, {
		/**
		 * Specified in seconds, <minRefreshPeriod> is the minimum allowed time between fetches of the file. This
		 * parameter allows servers to throttle fetches of a particular file and to tailor refresh rates to the expected
		 * rate of change to the data. For example, a user might set a link refresh to 5 seconds, but you could set your
		 * minimum refresh period to 3600 to limit refresh updates to once every hour.
		 * @memberof KmlNetworkLinkControl.prototype
		 * @readonly
		 * @type {Number}
		 */
		minRefreshPeriod: {
			get: function() {
				return this._factory.specific(this, {name: 'minRefreshPeriod', transformer: NodeTransformers.number});
			}
		},

		/**
		 * Specified in seconds, <maxSessionLength> is the maximum amount of time for which the client NetworkLink can
         * remain connected. The default value of -1 indicates not to terminate the session explicitly.
		 * @memberof KmlNetworkLinkControl.prototype
		 * @readonly
		 * @type {Number}
		 */
		maxSessionLength: {
			get: function() {
				return this._factory.specific(this, {name: 'maxSessionLength', transformer: NodeTransformers.number});
			}
		},

		/**
		 * Use this element to append a string to the URL query on the next refresh of the network link. You can use
         * this data in your script to provide more intelligent handling on the server side, including version querying
         * and conditional file delivery.
		 * @memberof KmlNetworkLinkControl.prototype
		 * @readonly
		 * @type {String}
		 */
		cookie: {
			get: function() {
				return this._factory.specific(this, {name: 'cookie', transformer: NodeTransformers.string});
			}
		},

		/**
		 * You can deliver a pop-up message, such as usage guidelines for your network link. The message appears when
         * the network link is first loaded into Google Earth, or when it is changed in the network link control.
		 * @memberof KmlNetworkLinkControl.prototype
		 * @readonly
		 * @type {String}
		 */
		message: {
			get: function() {
				return this._factory.specific(this, {name: 'message', transformer: NodeTransformers.string});
			}
		},

		/**
		 * You can control the name of the network link from the server, so that changes made to the name on the client
         * side are overridden by the server.
		 * @memberof KmlNetworkLinkControl.prototype
		 * @readonly
		 * @type {String}
		 */
		linkName: {
			get: function() {
				return this._factory.specific(this, {name: 'linkName', transformer: NodeTransformers.string});
			}
		},

		/**
		 * You can control the description of the network link from the server, so that changes made to the description
         * on the client side are overridden by the server.You can control the description of the network link from the
         * server, so that changes made to the description on the client side are overridden by the server.
		 * @memberof KmlNetworkLinkControl.prototype
		 * @readonly
		 * @type {String}
		 */
		linkDescription: {
			get: function() {
				return this._factory.specific(this, {name: 'linkDescription', transformer: NodeTransformers.string});
			}
		},

		/**
		 * You can control the snippet for the network link from the server, so that changes made to the snippet on the
         * client side are overridden by the server. <linkSnippet> has a maxLines attribute, an integer that specifies
         * the maximum number of lines to display.
		 * @memberof KmlNetworkLinkControl.prototype
		 * @readonly
		 * @type {String}
		 */
		linkSnippet: {
			get: function() {
				return this._factory.specific(this, {name: 'linkSnippet', transformer: NodeTransformers.string});
			}
		},

		/**
		 * You can specify a date/time at which the link should be refreshed. This specification takes effect only if
         * the <refreshMode> in <Link> has a value of onExpire. See <refreshMode>
		 * @memberof KmlNetworkLinkControl.prototype
		 * @readonly
		 * @type {Date}
		 */
		expires: {
			get: function() {
				return this._factory.specific(this, {name: 'expires', transformer: NodeTransformers.date});
			}
		},

		/**
		 * With <Update>, you can specify any number of Change, Create, and Delete tags for a .kml file or .kmz archive
         * that has previously been loaded with a network link. See <Update>.
		 * @memberof KmlNetworkLinkControl.prototype
		 * @readonly
		 * @type {Update}
		 */
		Update: {
			get: function() {
				return this._factory.any(this, {
					name: Update.prototype.getTagNames()
				});
			}
		},

		/**
		 * Either Camera or LookAt which will be used to fly to the location whenever the
		 * @memberof KmlNetworkLinkControl.prototype
		 * @readonly
		 * @type {AbstractView}
		 */
		AbstractView: {
			get: function() {
				return this._factory.any(this, {
					name: KmlAbstractView.prototype.getTagNames()
				});
			}
		}
	});

	/**
	 * @inheritDoc
	 */
	KmlNetworkLinkControl.prototype.getTagNames = function() {
		return ['NetworkLinkControl'];
	};

	KmlElements.addKey(KmlNetworkLinkControl.prototype.getTagNames()[0], KmlNetworkLinkControl);

	export default KmlNetworkLinkControl;
