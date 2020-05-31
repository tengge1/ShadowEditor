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
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */
func NewVector2(x, y float64) *Vector2 {
	return &Vector2{x, y, true}
}

type Vector2 struct {
	X float64
	Y float64
	IsVector2 bool
}

func (v Vector2) Width() float64 {
	return v.X
}

func (v Vector2) SetWidth(value float64) {
	v.X = value
}

func (v Vector2) Height() float64 {
	return v.Y
}

func (v Vector2) SetHeight(value float64) {
	v.Y = value
}

func (v Vector2) Set( x, y float64) *Vector2 {
	v.X = x
	v.Y = y
	return &v
}

func(v Vector2)SetScalar( scalar float64) *Vector2  {
	v.X = scalar
	v.Y = scalar
	return &v
}

func (v Vector2)SetX( x float64) *Vector2  {
	v.X = x
	return &v
}

func (v Vector2)SetY( y float64) *Vector2  {
	this.y = y;
	return &v
}

func (v Vector2)SetComponent( index int, value float64) *Vector2  {
	switch index  {
	default:
		 panic( "index is out of range: " + index )
		case 0: 
		v.x = value
		case 1: 
		v.y = value
	}
	return &v
}

func (v Vector2)GetComponent( index ) *Vector2 {
	switch index {
		default: 
		panic( "index is out of range: " + index )
		case 0: 
		return v.X
		case 1: 
		return v.Y
	}
}

func (v Vector2)Clone() *Vector2 {
	return NewVector2( v.X, v.Y )
}

func (v Vector2)Copy( w Vector2) *Vector2 {
	v.X = w.X
	v.Y = w.Y
	return &v
}

func (v Vector2)Add( w Vector2) *Vector2 {
	v.X += w.X
	v.Y += w.Y
	return &v
}

func (v Vector2)AddScalar( s float64) *Vector2 {
	v.X += s
	v.Y += s
	return &v
}

func (v Vector2)AddVectors( a, b Vector2) *Vector2 {
	v.X = a.X + b.X
	v.Y = a.Y + b.Y
	return &v
}

func (v *Vector2)AddScaledVector(w Vector2, s float64) *Vector2 {
	v.X += w.X * s
	v.Y += w.Y * s
	return &v
}

sub: function ( v, w ) {

	if ( w !== undefined ) {

		console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
		return this.subVectors( v, w );

	}

	this.x -= v.x;
	this.y -= v.y;

	return this;

},

subScalar: function ( s ) {

	this.x -= s;
	this.y -= s;

	return this;

},

subVectors: function ( a, b ) {

	this.x = a.x - b.x;
	this.y = a.y - b.y;

	return this;

},

multiply: function ( v ) {

	this.x *= v.x;
	this.y *= v.y;

	return this;

},

multiplyScalar: function ( scalar ) {

	this.x *= scalar;
	this.y *= scalar;

	return this;

},

divide: function ( v ) {

	this.x /= v.x;
	this.y /= v.y;

	return this;

},

divideScalar: function ( scalar ) {

	return this.multiplyScalar( 1 / scalar );

},

applyMatrix3: function ( m ) {

	var x = this.x, y = this.y;
	var e = m.elements;

	this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
	this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

	return this;

},

min: function ( v ) {

	this.x = Math.min( this.x, v.x );
	this.y = Math.min( this.y, v.y );

	return this;

},

max: function ( v ) {

	this.x = Math.max( this.x, v.x );
	this.y = Math.max( this.y, v.y );

	return this;

},

clamp: function ( min, max ) {

	// assumes min < max, componentwise

	this.x = Math.max( min.x, Math.min( max.x, this.x ) );
	this.y = Math.max( min.y, Math.min( max.y, this.y ) );

	return this;

},

clampScalar: function ( minVal, maxVal ) {

	this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
	this.y = Math.max( minVal, Math.min( maxVal, this.y ) );

	return this;

},

clampLength: function ( min, max ) {

	var length = this.length();

	return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

},

floor: function () {

	this.x = Math.floor( this.x );
	this.y = Math.floor( this.y );

	return this;

},

ceil: function () {

	this.x = Math.ceil( this.x );
	this.y = Math.ceil( this.y );

	return this;

},

round: function () {

	this.x = Math.round( this.x );
	this.y = Math.round( this.y );

	return this;

},

roundToZero: function () {

	this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
	this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

	return this;

},

negate: function () {

	this.x = - this.x;
	this.y = - this.y;

	return this;

},

dot: function ( v ) {

	return this.x * v.x + this.y * v.y;

},

cross: function ( v ) {

	return this.x * v.y - this.y * v.x;

},

lengthSq: function () {

	return this.x * this.x + this.y * this.y;

},

length: function () {

	return Math.sqrt( this.x * this.x + this.y * this.y );

},

manhattanLength: function () {

	return Math.abs( this.x ) + Math.abs( this.y );

},

normalize: function () {

	return this.divideScalar( this.length() || 1 );

},

angle: function () {

	// computes the angle in radians with respect to the positive x-axis

	var angle = Math.atan2( - this.y, - this.x ) + Math.PI;

	return angle;

},

distanceTo: function ( v ) {

	return Math.sqrt( this.distanceToSquared( v ) );

},

distanceToSquared: function ( v ) {

	var dx = this.x - v.x, dy = this.y - v.y;
	return dx * dx + dy * dy;

},

manhattanDistanceTo: function ( v ) {

	return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y );

},

setLength: function ( length ) {

	return this.normalize().multiplyScalar( length );

},

lerp: function ( v, alpha ) {

	this.x += ( v.x - this.x ) * alpha;
	this.y += ( v.y - this.y ) * alpha;

	return this;

},

lerpVectors: function ( v1, v2, alpha ) {

	this.x = v1.x + ( v2.x - v1.x ) * alpha;
	this.y = v1.y + ( v2.y - v1.y ) * alpha;

	return this;

},

equals: function ( v ) {

	return ( ( v.x === this.x ) && ( v.y === this.y ) );

},

fromArray: function ( array, offset ) {

	if ( offset === undefined ) offset = 0;

	this.x = array[ offset ];
	this.y = array[ offset + 1 ];

	return this;

},

toArray: function ( array, offset ) {

	if ( array === undefined ) array = [];
	if ( offset === undefined ) offset = 0;

	array[ offset ] = this.x;
	array[ offset + 1 ] = this.y;

	return array;

},

fromBufferAttribute: function ( attribute, index, offset ) {

	if ( offset !== undefined ) {

		console.warn( 'THREE.Vector2: offset has been removed from .fromBufferAttribute().' );

	}

	this.x = attribute.getX( index );
	this.y = attribute.getY( index );

	return this;

},

rotateAround: function ( center, angle ) {

	var c = Math.cos( angle ), s = Math.sin( angle );

	var x = this.x - center.x;
	var y = this.y - center.y;

	this.x = x * c - y * s + center.x;
	this.y = x * s + y * c + center.y;

	return this;

},

random: function () {

	this.x = Math.random();
	this.y = Math.random();

	return this;

}
