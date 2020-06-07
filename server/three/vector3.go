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

func NewVector3(x, y, z float64) *Vector3 {
	return &Vector3{x, y, z, true}
}

type Vector3 struct {
	X float64
	Y float64
	Z float64
	IsVector3 bool
}

var _vector = NewVector3(0, 0, 0)
var _quaternion = NewQuaternion()

func Set(x, y, z ) {
	this.x = x;
	this.y = y;
	this.z = z;

	return this;
}

func SetScalar( scalar ) {
	this.x = scalar;
	this.y = scalar;
	this.z = scalar;

	return this;
}

func SetX( x ) {
	this.x = x;

	return this;
}

func SetY( y ) {
	this.y = y;

	return this;
}

func SetZ( z ) {
	this.z = z;

	return this;
}

func SetComponent( index, value ) {
	switch index {
		default:
			panic("index is out of range: " + index )
		case 0:
			this.x = value
		case 1:
			this.y = value
		case 2:
			this.z = value
	}

	return this
}

func GetComponent( index ) {
	switch index {
		default: 
		    panic("index is out of range: " + index )
		case 0: 
		    return this.x;
		case 1: 
		    return this.y;
		case 2: 
		    return this.z;
	}
}

func Clone() {
	return new this.constructor( this.x, this.y, this.z );
}

func Copy( v ) {
	this.x = v.x;
	this.y = v.y;
	this.z = v.z;

	return this;
}

func Add( v, w ) {
	this.x += v.x;
	this.y += v.y;
	this.z += v.z;

	return this;
}

func AddScalar( s ) {
	this.x += s;
	this.y += s;
	this.z += s;

	return this;
}

func AddVectors( a, b ) {
	this.x = a.x + b.x;
	this.y = a.y + b.y;
	this.z = a.z + b.z;

	return this;
}

func AddScaledVector( v, s ) {
	this.x += v.x * s;
	this.y += v.y * s;
	this.z += v.z * s;

	return this;
}

func Sub( v, w ) {
	this.x -= v.x;
	this.y -= v.y;
	this.z -= v.z;

	return this;
}

func SubScalar( s ) {

	this.x -= s;
	this.y -= s;
	this.z -= s;

	return this;
}

func SubVectors( a, b ) {
	this.x = a.x - b.x;
	this.y = a.y - b.y;
	this.z = a.z - b.z;

	return this;
}

func Multiply( v, w ) {
	this.x *= v.x;
	this.y *= v.y;
	this.z *= v.z;

	return this;
}

func MultiplyScalar( scalar ) {
	this.x *= scalar;
	this.y *= scalar;
	this.z *= scalar;

	return this;
}

func MultiplyVectors( a, b ) {
	this.x = a.x * b.x;
	this.y = a.y * b.y;
	this.z = a.z * b.z;

	return this;
}

func ApplyEuler( euler ) {
	return this.applyQuaternion( _quaternion.setFromEuler( euler ) );
}

func ApplyAxisAngle( axis, angle ) {
	return this.applyQuaternion( _quaternion.setFromAxisAngle( axis, angle ) );
}

func ApplyMatrix3( m ) {
	var x = this.x, y = this.y, z = this.z;
	var e = m.elements;

	this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
	this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
	this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

	return this;
}

func ApplyNormalMatrix( m ) {
	return this.applyMatrix3( m ).normalize();
}

func ApplyMatrix4( m ) {
	var x = this.x, y = this.y, z = this.z;
	var e = m.elements;

	var w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

	this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
	this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
	this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

	return this;
}

func ApplyQuaternion( q ) {
	var x = this.x, y = this.y, z = this.z;
	var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

	// calculate quat * vector

	var ix = qw * x + qy * z - qz * y;
	var iy = qw * y + qz * x - qx * z;
	var iz = qw * z + qx * y - qy * x;
	var iw = - qx * x - qy * y - qz * z;

	// calculate result * inverse quat

	this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
	this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
	this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

	return this;
}

func Project( camera ) {
	return this.applyMatrix4( camera.matrixWorldInverse ).applyMatrix4( camera.projectionMatrix );
}

func Unproject( camera ) {
	return this.applyMatrix4( camera.projectionMatrixInverse ).applyMatrix4( camera.matrixWorld );
}

func TransformDirection( m ) {
	// input: THREE.Matrix4 affine matrix
	// vector interpreted as a direction

	var x = this.x, y = this.y, z = this.z;
	var e = m.elements;

	this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
	this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
	this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

	return this.normalize();
}

func Divide( v ) {
	this.x /= v.x;
	this.y /= v.y;
	this.z /= v.z;

	return this;
}

func DivideScalar( scalar ) {
	return this.multiplyScalar( 1 / scalar );
}

func Min( v ) {
	this.x = Math.min( this.x, v.x );
	this.y = Math.min( this.y, v.y );
	this.z = Math.min( this.z, v.z );

	return this;
}

func Max: function ( v ) {
	this.x = Math.max( this.x, v.x );
	this.y = Math.max( this.y, v.y );
	this.z = Math.max( this.z, v.z );

	return this;
}

func Clamp( min, max ) {
	// assumes min < max, componentwise

	this.x = Math.max( min.x, Math.min( max.x, this.x ) );
	this.y = Math.max( min.y, Math.min( max.y, this.y ) );
	this.z = Math.max( min.z, Math.min( max.z, this.z ) );

	return this;
}

func ClampScalar( minVal, maxVal ) {
	this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
	this.y = Math.max( minVal, Math.min( maxVal, this.y ) );
	this.z = Math.max( minVal, Math.min( maxVal, this.z ) );

	return this;
}

func ClampLength( min, max ) {
	var length = this.length();

	return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );
}

func Floor() {
	this.x = Math.floor( this.x );
	this.y = Math.floor( this.y );
	this.z = Math.floor( this.z );

	return this
}

func Ceil() {
	this.x = Math.ceil( this.x );
	this.y = Math.ceil( this.y );
	this.z = Math.ceil( this.z );

	return this;
}

func Round() {
	this.x = Math.round( this.x );
	this.y = Math.round( this.y );
	this.z = Math.round( this.z );

	return this
}

func RoundToZero() {
	this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
	this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
	this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

	return this;
}

func Negate() {
	this.x = - this.x;
	this.y = - this.y;
	this.z = - this.z;

	return this;
}

func Dot: function ( v ) {
	return this.x * v.x + this.y * v.y + this.z * v.z;
}

func LengthSq() {
	return this.x * this.x + this.y * this.y + this.z * this.z;
}

func Length() {
	return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
}

func ManhattanLength() {
	return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z )
}

func Normalize() {
	return this.divideScalar( this.length() || 1 );
}

func SetLength( length ) {
	return this.normalize().multiplyScalar( length );
}

func Lerp( v, alpha ) {
	this.x += ( v.x - this.x ) * alpha;
	this.y += ( v.y - this.y ) * alpha;
	this.z += ( v.z - this.z ) * alpha;

	return this
}

func LerpVectors( v1, v2, alpha ) {
	this.x = v1.x + ( v2.x - v1.x ) * alpha;
	this.y = v1.y + ( v2.y - v1.y ) * alpha;
	this.z = v1.z + ( v2.z - v1.z ) * alpha;

	return this;
}

func Cross( v, w ) {
	return this.crossVectors( this, v );
}

func CrossVectors( a, b ) {
	var ax = a.x, ay = a.y, az = a.z;
	var bx = b.x, by = b.y, bz = b.z;

	this.x = ay * bz - az * by;
	this.y = az * bx - ax * bz;
	this.z = ax * by - ay * bx;

	return this;
}

func ProjectOnVector( v ) {
	var denominator = v.lengthSq();

	if ( denominator === 0 ) return this.set( 0, 0, 0 );

	var scalar = v.dot( this ) / denominator;

	return this.copy( v ).multiplyScalar( scalar );
}

func ProjectOnPlane( planeNormal ) {
	_vector.copy( this ).projectOnVector( planeNormal );

	return this.sub( _vector );
}

func Reflect( normal ) {
	// reflect incident vector off plane orthogonal to normal
	// normal is assumed to have unit length

	return this.sub( _vector.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );
}

func AngleTo( v ) {
	var denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );

	if ( denominator === 0 ) return Math.PI / 2;

	var theta = this.dot( v ) / denominator;

	// clamp, to handle numerical problems

	return Math.acos( Clamp( theta, - 1, 1 ) );
}

func DistanceTo( v ) {
	return Math.sqrt( this.distanceToSquared( v ) );
}

func DistanceToSquared( v ) {
	var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

	return dx * dx + dy * dy + dz * dz;
}

func ManhattanDistanceTo( v ) {
	return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y ) + Math.abs( this.z - v.z );
}

func SetFromSpherical( s ) {
	return this.setFromSphericalCoords( s.radius, s.phi, s.theta );
}

func SetFromSphericalCoords( radius, phi, theta ) {
	var sinPhiRadius = Math.sin( phi ) * radius;

	this.x = sinPhiRadius * Math.sin( theta );
	this.y = Math.cos( phi ) * radius;
	this.z = sinPhiRadius * Math.cos( theta );

	return this;
}

func SetFromCylindrical: function ( c ) {
	return this.setFromCylindricalCoords( c.radius, c.theta, c.y );
}

func SetFromCylindricalCoords: function ( radius, theta, y ) {
	this.x = radius * Math.sin( theta );
	this.y = y;
	this.z = radius * Math.cos( theta );

	return this;
}

func SetFromMatrixPosition: function ( m ) {
	var e = m.elements;

	this.x = e[ 12 ];
	this.y = e[ 13 ];
	this.z = e[ 14 ];

	return this;
}

func SetFromMatrixScale( m ) {
	var sx = this.setFromMatrixColumn( m, 0 ).length();
	var sy = this.setFromMatrixColumn( m, 1 ).length();
	var sz = this.setFromMatrixColumn( m, 2 ).length();

	this.x = sx;
	this.y = sy;
	this.z = sz;

	return this;
}

func SetFromMatrixColumn( m, index ) {
	return this.fromArray( m.elements, index * 4 );
}

func SetFromMatrix3Column( m, index ) {
	return this.fromArray( m.elements, index * 3 )
}

func Equals( v ) {
	return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );
}

func FromArray( array, offset ) {
	if ( offset === undefined ) offset = 0;

	this.x = array[ offset ];
	this.y = array[ offset + 1 ];
	this.z = array[ offset + 2 ];

	return this;
}

func ToArray( array, offset ) {
	if ( array === undefined ) array = [];
	if ( offset === undefined ) offset = 0;

	array[ offset ] = this.x;
	array[ offset + 1 ] = this.y;
	array[ offset + 2 ] = this.z;

	return array;
}

func FromBufferAttribute( attribute, index, offset ) {
	this.x = attribute.getX( index );
	this.y = attribute.getY( index );
	this.z = attribute.getZ( index );

	return this;
}

func Random() {
	this.x = Math.random();
	this.y = Math.random();
	this.z = Math.random();

	return this;
}