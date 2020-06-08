// +build ignore

// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor
//
// This package is translated from three.js, visit `https://github.com/mrdoob/three.js`
// for more information.

package three

/**
 * @author bhouston / http://clara.io
 */

var _startP = new Vector3();
var _startEnd = new Vector3();

function Line3( start, end ) {

	this.start = ( start !== undefined ) ? start : new Vector3();
	this.end = ( end !== undefined ) ? end : new Vector3();

}

Object.assign( Line3.prototype, {

	set: function ( start, end ) {

		this.start.copy( start );
		this.end.copy( end );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( line ) {

		this.start.copy( line.start );
		this.end.copy( line.end );

		return this;

	},

	getCenter: function ( target ) {

		if ( target === undefined ) {

			console.warn( 'THREE.Line3: .getCenter() target is now required' );
			target = new Vector3();

		}

		return target.addVectors( this.start, this.end ).multiplyScalar( 0.5 );

	},

	delta: function ( target ) {

		if ( target === undefined ) {

			console.warn( 'THREE.Line3: .delta() target is now required' );
			target = new Vector3();

		}

		return target.subVectors( this.end, this.start );

	},

	distanceSq: function () {

		return this.start.distanceToSquared( this.end );

	},

	distance: function () {

		return this.start.distanceTo( this.end );

	},

	at: function ( t, target ) {

		if ( target === undefined ) {

			console.warn( 'THREE.Line3: .at() target is now required' );
			target = new Vector3();

		}

		return this.delta( target ).multiplyScalar( t ).add( this.start );

	},

	closestPointToPointParameter: function ( point, clampToLine ) {

		_startP.subVectors( point, this.start );
		_startEnd.subVectors( this.end, this.start );

		var startEnd2 = _startEnd.dot( _startEnd );
		var startEnd_startP = _startEnd.dot( _startP );

		var t = startEnd_startP / startEnd2;

		if ( clampToLine ) {

			t = MathUtils.clamp( t, 0, 1 );

		}

		return t;

	},

	closestPointToPoint: function ( point, clampToLine, target ) {

		var t = this.closestPointToPointParameter( point, clampToLine );

		if ( target === undefined ) {

			console.warn( 'THREE.Line3: .closestPointToPoint() target is now required' );
			target = new Vector3();

		}

		return this.delta( target ).multiplyScalar( t ).add( this.start );

	},

	applyMatrix4: function ( matrix ) {

		this.start.applyMatrix4( matrix );
		this.end.applyMatrix4( matrix );

		return this;

	},

	equals: function ( line ) {

		return line.start.equals( this.start ) && line.end.equals( this.end );

	}

} );