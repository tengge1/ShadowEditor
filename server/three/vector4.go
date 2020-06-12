// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of v source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor
//
// This package is translated from three.js, visit `https://github.com/mrdoob/three.js`
// for more information.

package three

 func NewVector4( x, y, z, w float64) *Vector4 {
	 return &Vector4{x,y,z,w}
}

type Vector4 struct {
	X float64
	Y float64
	Z float64
	W float64
}

func (v Vector4)Width() float64 {
	return v.Z
}

func (v Vector4)SetWidth(value float64) *Vector4 {
	v.Z = value
	return &v
}

func (v Vector4)Height() float64 {
	return v.W
}

func (v Vector4)SetHeight(value float64) *Vector4 {
	v.W = value
	return &v
}

func Set( x, y, z, w float64) {
	v.x = x;
	v.y = y;
	v.z = z;
	v.w = w;
	return v;
}

func SetScalar( scalar ) {
	v.x = scalar;
	v.y = scalar;
	v.z = scalar;
	v.w = scalar;
	return v;
}

func SetX( x ) {
	v.x = x;
	return v;
}

func SetY( y ) {
	v.y = y;
	return v;
}

func SetZ( z ) {
	v.z = z;
	return v;
}

func SetW( w ) {
	v.w = w;
	return v;
}

func SetComponent( index, value ) {
	switch ( index ) {
		case 0: v.x = value; break;
		case 1: v.y = value; break;
		case 2: v.z = value; break;
		case 3: v.w = value; break;
		default: throw new Error( 'index is out of range: ' + index );
	}
	return v;
}

func GetComponent( index ) {
	switch ( index ) {
		case 0: return v.x;
		case 1: return v.y;
		case 2: return v.z;
		case 3: return v.w;
		default: throw new Error( 'index is out of range: ' + index );
	}
}

func Clone() {
	return new v.constructor( v.x, v.y, v.z, v.w );
}

func Copy( v1 ) {
	v.x = v1.x;
	v.y = v1.y;
	v.z = v1.z;
	v.w = ( v1.w !== undefined ) ? v1.w : 1;
	return v;
}

func Add( v1, w ) {
	if ( w !== undefined ) {
		console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
		return v.addVectors( v1, w );
	}
	v.x += v1.x;
	v.y += v1.y;
	v.z += v1.z;
	v.w += v1.w;
	return v;
}

func AddScalar( s ) {
	v.x += s;
	v.y += s;
	v.z += s;
	v.w += s;
	return v;
}

func AddVectors( a, b ) {
	v.x = a.x + b.x;
	v.y = a.y + b.y;
	v.z = a.z + b.z;
	v.w = a.w + b.w;
	return v;
}

func AddScaledVector( v1, s ) {
	v.x += v1.x * s;
	v.y += v1.y * s;
	v.z += v1.z * s;
	v.w += v1.w * s;
	return v;
}

func Sub( v1, w ) {
	if ( w !== undefined ) {
		console.warn( 'THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
		return v.subVectors( v1, w );
	}
	v.x -= v1.x;
	v.y -= v1.y;
	v.z -= v1.z;
	v.w -= v1.w;
	return v;
}

func SubScalar( s ) {
	v.x -= s;
	v.y -= s;
	v.z -= s;
	v.w -= s;
	return v;
}

func SubVectors( a, b ) {
	v.x = a.x - b.x;
	v.y = a.y - b.y;
	v.z = a.z - b.z;
	v.w = a.w - b.w;
	return v;
}

func MultiplyScalar( scalar ) {
	v.x *= scalar;
	v.y *= scalar;
	v.z *= scalar;
	v.w *= scalar;
	return v;
}

func ApplyMatrix4( m ) {
	var x = v.x, y = v.y, z = v.z, w = v.w;
	var e = m.elements;

	v.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
	v.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
	v.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
	v.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

	return v;
}

func DivideScalar( scalar ) {
	return v.multiplyScalar( 1 / scalar );
}

func SetAxisAngleFromQuaternion( q ) {
	// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
	// q is assumed to be normalized
	v.w = 2 * Math.acos( q.w );
	var s = Math.sqrt( 1 - q.w * q.w );
	if ( s < 0.0001 ) {
		v.x = 1;
		v.y = 0;
		v.z = 0;
	} else {
		v.x = q.x / s;
		v.y = q.y / s;
		v.z = q.z / s;
	}
	return v;
}

func SetAxisAngleFromRotationMatrix( m ) {
	// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
	// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
	var angle, x, y, z,		// variables for result
		epsilon = 0.01,		// margin to allow for rounding errors
		epsilon2 = 0.1,		// margin to distinguish between 0 and 180 degrees

		te = m.elements,

		m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
		m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
		m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

	if ( ( Math.abs( m12 - m21 ) < epsilon ) &&
		 ( Math.abs( m13 - m31 ) < epsilon ) &&
		 ( Math.abs( m23 - m32 ) < epsilon ) ) {
		// singularity found
		// first check for identity matrix which must have +1 for all terms
		// in leading diagonal and zero in other terms
		if ( ( Math.abs( m12 + m21 ) < epsilon2 ) &&
			 ( Math.abs( m13 + m31 ) < epsilon2 ) &&
			 ( Math.abs( m23 + m32 ) < epsilon2 ) &&
			 ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

			// v singularity is identity matrix so angle = 0
			v.set( 1, 0, 0, 0 );
			return v; // zero angle, arbitrary axis
		}
		// otherwise v singularity is angle = 180
		angle = Math.PI;

		var xx = ( m11 + 1 ) / 2;
		var yy = ( m22 + 1 ) / 2;
		var zz = ( m33 + 1 ) / 2;
		var xy = ( m12 + m21 ) / 4;
		var xz = ( m13 + m31 ) / 4;
		var yz = ( m23 + m32 ) / 4;

		if ( ( xx > yy ) && ( xx > zz ) ) {
			// m11 is the largest diagonal term
			if ( xx < epsilon ) {
				x = 0;
				y = 0.707106781;
				z = 0.707106781;
			} else {
				x = Math.sqrt( xx );
				y = xy / x;
				z = xz / x;
			}
		} else if ( yy > zz ) {
			// m22 is the largest diagonal term
			if ( yy < epsilon ) {
				x = 0.707106781;
				y = 0;
				z = 0.707106781;
			} else {
				y = Math.sqrt( yy );
				x = xy / y;
				z = yz / y;
			}
		} else {
			// m33 is the largest diagonal term so base result on v
			if ( zz < epsilon ) {
				x = 0.707106781;
				y = 0.707106781;
				z = 0;
			} else {
				z = Math.sqrt( zz );
				x = xz / z;
				y = yz / z;
			}
		}

		v.set( x, y, z, angle );
		return v; // return 180 deg rotation
	}

	// as we have reached here there are no singularities so we can handle normally
	var s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 ) +
					   ( m13 - m31 ) * ( m13 - m31 ) +
					   ( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

	if ( Math.abs( s ) < 0.001 ) s = 1;
	// prevent divide by zero, should not happen if matrix is orthogonal and should be
	// caught by singularity test above, but I've left it in just in case

	v.x = ( m32 - m23 ) / s;
	v.y = ( m13 - m31 ) / s;
	v.z = ( m21 - m12 ) / s;
	v.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

	return v;
}

func Min( v1 ) {
	v.x = Math.min( v.x, v1.x );
	v.y = Math.min( v.y, v1.y );
	v.z = Math.min( v.z, v1.z );
	v.w = Math.min( v.w, v1.w );
	return v;
}

func Max( v1 ) {
	v.x = Math.max( v.x, v1.x );
	v.y = Math.max( v.y, v1.y );
	v.z = Math.max( v.z, v1.z );
	v.w = Math.max( v.w, v1.w );
	return v;
}

func Clamp( min, max ) {
	// assumes min < max, componentwise
	v.x = Math.max( min.x, Math.min( max.x, v.x ) );
	v.y = Math.max( min.y, Math.min( max.y, v.y ) );
	v.z = Math.max( min.z, Math.min( max.z, v.z ) );
	v.w = Math.max( min.w, Math.min( max.w, v.w ) );
	return v;
}

func ClampScalar( minVal, maxVal ) {
	v.x = Math.max( minVal, Math.min( maxVal, v.x ) );
	v.y = Math.max( minVal, Math.min( maxVal, v.y ) );
	v.z = Math.max( minVal, Math.min( maxVal, v.z ) );
	v.w = Math.max( minVal, Math.min( maxVal, v.w ) );
	return v;
}

func ClampLength( min, max ) {
	var length = v.length();
	return v.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );
}

func Floor() {
	v.x = Math.floor( v.x );
	v.y = Math.floor( v.y );
	v.z = Math.floor( v.z );
	v.w = Math.floor( v.w );
	return v;
}

func Ceil() {
	v.x = Math.ceil( v.x );
	v.y = Math.ceil( v.y );
	v.z = Math.ceil( v.z );
	v.w = Math.ceil( v.w );
	return v;
}

func Round() {
	v.x = Math.round( v.x );
	v.y = Math.round( v.y );
	v.z = Math.round( v.z );
	v.w = Math.round( v.w );
	return v;
}

func RoundToZero() {
	v.x = ( v.x < 0 ) ? Math.ceil( v.x ) : Math.floor( v.x );
	v.y = ( v.y < 0 ) ? Math.ceil( v.y ) : Math.floor( v.y );
	v.z = ( v.z < 0 ) ? Math.ceil( v.z ) : Math.floor( v.z );
	v.w = ( v.w < 0 ) ? Math.ceil( v.w ) : Math.floor( v.w );
	return v;
}

func Negate() {
	v.x = - v.x;
	v.y = - v.y;
	v.z = - v.z;
	v.w = - v.w;
	return v;
}

func Dot( v1 ) {
	return v.x * v1.x + v.y * v1.y + v.z * v1.z + v.w * v1.w;
}

func LengthSq() {
	return v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w;
}

func Length() {
	return Math.sqrt( v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w );
}

func ManhattanLength() {
	return Math.abs( v.x ) + Math.abs( v.y ) + Math.abs( v.z ) + Math.abs( v.w );
}

func Normalize() {
	return v.divideScalar( v.length() || 1 );
}

func SetLength( length ) {
	return v.normalize().multiplyScalar( length );
}

func Lerp( v1, alpha ) {
	v.x += ( v1.x - v.x ) * alpha;
	v.y += ( v1.y - v.y ) * alpha;
	v.z += ( v1.z - v.z ) * alpha;
	v.w += ( v1.w - v.w ) * alpha;
	return v;
}

func LerpVectors( v1, v2, alpha ) {
	v.x = v1.x + ( v2.x - v1.x ) * alpha;
	v.y = v1.y + ( v2.y - v1.y ) * alpha;
	v.z = v1.z + ( v2.z - v1.z ) * alpha;
	v.w = v1.w + ( v2.w - v1.w ) * alpha;
	return v;
}

func Equals( v1 ) {
	return ( ( v1.x === v.x ) && ( v1.y === v.y ) && ( v1.z === v.z ) && ( v1.w === v.w ) );
}

func FromArray( array, offset ) {
	if ( offset === undefined ) offset = 0;
	v.x = array[ offset ];
	v.y = array[ offset + 1 ];
	v.z = array[ offset + 2 ];
	v.w = array[ offset + 3 ];
	return v;
}

func ToArray( array, offset ) {
	if ( array === undefined ) array = [];
	if ( offset === undefined ) offset = 0;
	array[ offset ] = v.x;
	array[ offset + 1 ] = v.y;
	array[ offset + 2 ] = v.z;
	array[ offset + 3 ] = v.w;
	return array;
}

func Random() {
	v.x = Math.random();
	v.y = Math.random();
	v.z = Math.random();
	v.w = Math.random();
	return v;
}