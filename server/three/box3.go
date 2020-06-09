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

var _points = []Vector3{
	NewVector3(0,0,0),
	NewVector3(0,0,0),
	NewVector3(0,0,0),
	NewVector3(0,0,0),
	NewVector3(0,0,0),
	NewVector3(0,0,0),
	NewVector3(0,0,0),
	NewVector3(0,0,0),
};

var _vector = NewVector3(0,0,0);

var _box = NewBox3(0,0,0);

// triangle centered vertices

var _v0 = NewVector3(0,0,0);
var _v1 = NewVector3(0,0,0);
var _v2 = NewVector3(0,0,0);

// triangle edge vectors

var _f0 = NewVector3(0,0,0);
var _f1 = NewVector3(0,0,0);
var _f2 = NewVector3(0,0,0);

var _center = NewVector3(0,0,0);
var _extents = NewVector3(0,0,0);
var _triangleNormal = NewVector3(0,0,0);
var _testAxis = NewVector3(0,0,0);

func NewBox3( min, max Vector3) *Box3 {
	return &Box{min, max}
}

type Box3 struct {
	Min Vector3
	Max Vector3
}

func Set( min, max ) {
	b.min.copy( min );
	b.max.copy( max );

	return b;
}

func SetFromArray( array ) {
	var minX = + Infinity;
	var minY = + Infinity;
	var minZ = + Infinity;

	var maxX = - Infinity;
	var maxY = - Infinity;
	var maxZ = - Infinity;

	for ( var i = 0, l = array.length; i < l; i += 3 ) {
		var x = array[ i ];
		var y = array[ i + 1 ];
		var z = array[ i + 2 ];

		if ( x < minX ) minX = x;
		if ( y < minY ) minY = y;
		if ( z < minZ ) minZ = z;

		if ( x > maxX ) maxX = x;
		if ( y > maxY ) maxY = y;
		if ( z > maxZ ) maxZ = z;
	}

	b.min.set( minX, minY, minZ );
	b.max.set( maxX, maxY, maxZ );

	return b;
}

func SetFromPoints( points ) {
	b.makeEmpty();

	for ( var i = 0, il = points.length; i < il; i ++ ) {
		b.expandByPoint( points[ i ] );
	}

	return b;
}

func SetFromCenterAndSize( center, size ) {
	var halfSize = _vector.copy( size ).multiplyScalar( 0.5 );

	b.min.copy( center ).sub( halfSize );
	b.max.copy( center ).add( halfSize );

	return b;
}

func SetFromObject( object ) {
	b.makeEmpty();

	return b.expandByObject( object );
}

func Clone() {
	return new b.constructor().copy( b );
}

func Copy( box ) {
	b.min.copy( box.min );
	b.max.copy( box.max );

	return b;
}

func MakeEmpty() {
	b.min.x = b.min.y = b.min.z = + Infinity;
	b.max.x = b.max.y = b.max.z = - Infinity;

	return b;
}

func IsEmpty() {
	// b is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
	return ( b.max.x < b.min.x ) || ( b.max.y < b.min.y ) || ( b.max.z < b.min.z );
}

func GetCenter( target ) {
	return b.isEmpty() ? target.set( 0, 0, 0 ) : target.addVectors( b.min, b.max ).multiplyScalar( 0.5 );
}

func GetSize( target ) {
	return b.isEmpty() ? target.set( 0, 0, 0 ) : target.subVectors( b.max, b.min );
}

func ExpandByPoint( point ) {
	b.min.min( point );
	b.max.max( point );

	return b;
}

func ExpandByVector( vector ) {
	b.min.sub( vector );
	b.max.add( vector );

	return b;
}

func ExpandByScalar( scalar ) {
	b.min.addScalar( - scalar );
	b.max.addScalar( scalar );

	return b;
}

func ExpandByObject( object ) {
	// Computes the world-axis-aligned bounding box of an object (including its children),
	// accounting for both the object's, and children's, world transforms
	object.updateWorldMatrix( false, false );

	var geometry = object.geometry;

	if ( geometry !== undefined ) {
		if ( geometry.boundingBox === null ) {
			geometry.computeBoundingBox();
		}

		_box.copy( geometry.boundingBox );
		_box.applyMatrix4( object.matrixWorld );

		b.union( _box );
	}

	var children = object.children;

	for ( var i = 0, l = children.length; i < l; i ++ ) {
		b.expandByObject( children[ i ] );
	}

	return b;
}

func ContainsPoint( point ) {
	return point.x < b.min.x || point.x > b.max.x ||
		point.y < b.min.y || point.y > b.max.y ||
		point.z < b.min.z || point.z > b.max.z ? false : true;
}

func ContainsBox( box ) {
	return b.min.x <= box.min.x && box.max.x <= b.max.x &&
		b.min.y <= box.min.y && box.max.y <= b.max.y &&
		b.min.z <= box.min.z && box.max.z <= b.max.z;
}

func GetParameter( point, target ) {
	// b can potentially have a divide by zero if the box
	// has a size dimension of 0.
	return target.set(
		( point.x - b.min.x ) / ( b.max.x - b.min.x ),
		( point.y - b.min.y ) / ( b.max.y - b.min.y ),
		( point.z - b.min.z ) / ( b.max.z - b.min.z )
	);
}

func IntersectsBox( box ) {
	// using 6 splitting planes to rule out intersections.
	return box.max.x < b.min.x || box.min.x > b.max.x ||
		box.max.y < b.min.y || box.min.y > b.max.y ||
		box.max.z < b.min.z || box.min.z > b.max.z ? false : true;
}

func IntersectsSphere( sphere ) {
	// Find the point on the AABB closest to the sphere center.
	b.clampPoint( sphere.center, _vector );

	// If that point is inside the sphere, the AABB and sphere intersect.
	return _vector.distanceToSquared( sphere.center ) <= ( sphere.radius * sphere.radius );
}

func IntersectsPlane( plane ) {
	// We compute the minimum and maximum dot product values. If those values
	// are on the same side (back or front) of the plane, then there is no intersection.
	var min, max;

	if ( plane.normal.x > 0 ) {
		min = plane.normal.x * b.min.x;
		max = plane.normal.x * b.max.x;
	} else {
		min = plane.normal.x * b.max.x;
		max = plane.normal.x * b.min.x;
	}

	if ( plane.normal.y > 0 ) {
		min += plane.normal.y * b.min.y;
		max += plane.normal.y * b.max.y;
	} else {
		min += plane.normal.y * b.max.y;
		max += plane.normal.y * b.min.y;
	}

	if ( plane.normal.z > 0 ) {
		min += plane.normal.z * b.min.z;
		max += plane.normal.z * b.max.z;
	} else {
		min += plane.normal.z * b.max.z;
		max += plane.normal.z * b.min.z;
	}

	return ( min <= - plane.constant && max >= - plane.constant );
}

func IntersectsTriangle( triangle ) {
	if ( b.isEmpty() ) {
		return false;
	}

	// compute box center and extents
	b.getCenter( _center );
	_extents.subVectors( b.max, _center );

	// translate triangle to aabb origin
	_v0.subVectors( triangle.a, _center );
	_v1.subVectors( triangle.b, _center );
	_v2.subVectors( triangle.c, _center );

	// compute edge vectors for triangle
	_f0.subVectors( _v1, _v0 );
	_f1.subVectors( _v2, _v1 );
	_f2.subVectors( _v0, _v2 );

	// test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
	// make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
	// axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
	var axes = [
		0, - _f0.z, _f0.y, 0, - _f1.z, _f1.y, 0, - _f2.z, _f2.y,
		_f0.z, 0, - _f0.x, _f1.z, 0, - _f1.x, _f2.z, 0, - _f2.x,
		- _f0.y, _f0.x, 0, - _f1.y, _f1.x, 0, - _f2.y, _f2.x, 0
	];
	if ( ! satForAxes( axes, _v0, _v1, _v2, _extents ) ) {
		return false;
	}

	// test 3 face normals from the aabb
	axes = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
	if ( ! satForAxes( axes, _v0, _v1, _v2, _extents ) ) {
		return false;
	}

	// finally testing the face normal of the triangle
	// use already existing triangle edge vectors here
	_triangleNormal.crossVectors( _f0, _f1 );
	axes = [ _triangleNormal.x, _triangleNormal.y, _triangleNormal.z ];

	return satForAxes( axes, _v0, _v1, _v2, _extents );
}

func ClampPoint( point, target ) {
	return target.copy( point ).clamp( b.min, b.max );
}

func DistanceToPoint( point ) {
	var clampedPoint = _vector.copy( point ).clamp( b.min, b.max );
	return clampedPoint.sub( point ).length();
}

func GetBoundingSphere( target ) {
	b.getCenter( target.center );
	target.radius = b.getSize( _vector ).length() * 0.5;
	return target;
}

func Intersect( box ) {
	b.min.max( box.min );
	b.max.min( box.max );

	// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
	if ( b.isEmpty() ) b.makeEmpty();

	return b;
}

func Union( box ) {
	b.min.min( box.min );
	b.max.max( box.max );

	return b;
}

func ApplyMatrix4( matrix ) {
	// transform of empty box is an empty box.
	if ( b.isEmpty() ) return b;

	// NOTE: I am using a binary pattern to specify all 2^3 combinations below
	_points[ 0 ].set( b.min.x, b.min.y, b.min.z ).applyMatrix4( matrix ); // 000
	_points[ 1 ].set( b.min.x, b.min.y, b.max.z ).applyMatrix4( matrix ); // 001
	_points[ 2 ].set( b.min.x, b.max.y, b.min.z ).applyMatrix4( matrix ); // 010
	_points[ 3 ].set( b.min.x, b.max.y, b.max.z ).applyMatrix4( matrix ); // 011
	_points[ 4 ].set( b.max.x, b.min.y, b.min.z ).applyMatrix4( matrix ); // 100
	_points[ 5 ].set( b.max.x, b.min.y, b.max.z ).applyMatrix4( matrix ); // 101
	_points[ 6 ].set( b.max.x, b.max.y, b.min.z ).applyMatrix4( matrix ); // 110
	_points[ 7 ].set( b.max.x, b.max.y, b.max.z ).applyMatrix4( matrix ); // 111

	b.setFromPoints( _points );

	return b;
}

func Translate( offset ) {
	b.min.add( offset );
	b.max.add( offset );

	return b;
}

func Equals( box ) {
	return box.min.equals( b.min ) && box.max.equals( b.max );
}

func satForAxes( axes, v0, v1, v2, extents ) bool {
	var i, j;

	for ( i = 0, j = axes.length - 3; i <= j; i += 3 ) {

		_testAxis.fromArray( axes, i );
		// project the aabb onto the seperating axis
		var r = extents.x * Math.abs( _testAxis.x ) + extents.y * Math.abs( _testAxis.y ) + extents.z * Math.abs( _testAxis.z );
		// project all 3 vertices of the triangle onto the seperating axis
		var p0 = v0.dot( _testAxis );
		var p1 = v1.dot( _testAxis );
		var p2 = v2.dot( _testAxis );
		// actual test, basically see if either of the most extreme of the triangle points intersects r
		if ( Math.max( - Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

			// points of the projected triangle are outside the projected half-length of the aabb
			// the axis is seperating and we can exit
			return false;

		}

	}

	return true;
}