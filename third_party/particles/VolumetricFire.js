
/**
 * @author yomotsu / http://yomotsu.net
 * ported from http://webgl-fire.appspot.com/html/fire.html
 *
 * https://www.youtube.com/watch?v=jKRHmQmduDI
 * https://graphics.ethz.ch/teaching/former/imagesynthesis_06/miniprojects/p3/
 * https://www.iusb.edu/math-compsci/_prior-thesis/YVanzine_thesis.pdf
 */

( function ( root, factory ) {

  if ( typeof define === 'function' && define.amd ) {

    // AMD. Register as an anonymous module.
    define( [], factory );

  } else if ( typeof module === 'object' && module.exports ) {

    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();

  } else {

    // Browser globals (root is window)
    root.VolumetricFire = factory( root );

  }

}( this, function () {

  'use strict';

  var vs = [

    'attribute vec3 position;',
    'attribute vec3 tex;',
    'uniform mat4 projectionMatrix;',
    'uniform mat4 modelViewMatrix;',

    'varying vec3 texOut;',

    'void main ( void ) {',

      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );',
      'texOut = tex;',

    '}',

  ].join( '\n' );

  var fs = [

    'precision highp float;',

    // Modified Blum Blum Shub pseudo-random number generator.
    'vec2 mBBS( vec2 val, float modulus ) {',

      'val = mod( val, modulus ); // For numerical consistancy.',
      'return mod(val * val, modulus);',

    '}',

    // Pregenerated noise texture.
    'uniform sampler2D nzw;',
    'const float modulus = 61.0;  // Value used in pregenerated noise texture.',

    /**
     * Modified noise function.
     * @see http://www.csee.umbc.edu/~olano/papers/index.html#mNoise
     **/
    'float mnoise ( vec3 pos ) {',

      'float intArg = floor( pos.z );',
      'float fracArg = fract( pos.z );',
      'vec2 hash = mBBS( intArg * 3.0 + vec2( 0, 3 ), modulus );',
      'vec4 g = vec4 (',
        'texture2D( nzw, vec2( pos.x, pos.y + hash.x ) / modulus ).xy,',
        'texture2D( nzw, vec2( pos.x, pos.y + hash.y ) / modulus ).xy',
      ') * 2.0 - 1.0;',

      'return mix(',
        'g.x + g.y * fracArg,',
        'g.z + g.w * ( fracArg - 1.0 ),',
        'smoothstep( 0.0, 1.0, fracArg )',
      ');',

    '}',

    'const int octives = 4;',
    'const float lacunarity = 2.0;',
    'const float gain = 0.5;',

    /**
     * Adds multiple octives of noise together.
     **/
    'float turbulence( vec3 pos ) {',

      'float sum  = 0.0;',
      'float freq = 1.0;',
      'float amp  = 1.0;',

      'for ( int i = 0; i < 4; i++ ) {',

        'sum += abs( mnoise( pos * freq ) ) * amp;',
        'freq *= lacunarity;',
        'amp *= gain;',

      '}',

      'return sum;',

    '}',

    'const float magnatude = 1.3;',
    'uniform float time;',
    'uniform sampler2D fireProfile;',

    /**
     * Samples the fire.
     *
     * @param loc the normalized location (0.0-1.0) to sample the fire
     * @param scale the 'size' of the fire in world space and time
     **/
    'vec4 sampleFire( vec3 loc, vec4 scale ) {',

      // Convert xz to [-1.0, 1.0] range.
      'loc.xz = loc.xz * 2.0 - 1.0;',

      // Convert to (radius, height) to sample fire profile texture.
      'vec2 st = vec2( sqrt( dot( loc.xz, loc.xz ) ), loc.y );',

      // Convert loc to 'noise' space
      'loc.y -= time * scale.w; // Scrolling noise upwards over time.',
      'loc *= scale.xyz; // Scaling noise space.',

      // Offsetting vertial texture lookup.
      // We scale this by the sqrt of the height so that things are
      // relatively stable at the base of the fire and volital at the
      // top.
      'float offset = sqrt( st.y ) * magnatude * turbulence( loc );',
      'st.y += offset;',

      // TODO: Update fireProfile texture to have a black row of pixels.
      'if ( st.y > 1.0 ) {',

        'return vec4( 0, 0, 0, 1 );',

      '}',

      'vec4 result = texture2D( fireProfile, st );',

      // Fading out bottom so slice clipping isnt obvious
      'if ( st.y < 0.1 ) {',

        'result *= st.y / 0.1;',

      '}',

      'return result;',

    '}',

    'varying vec3 texOut;',

    'void main( void ) {',

      // Mapping texture coordinate to -1 => 1 for xy, 0=> 1 for y
      'vec3 color = sampleFire( texOut, vec4( 1.0, 2.0, 1.0, 0.5 ) ).xyz;',
      'gl_FragColor = vec4( color * 1.5, 1 );',

    '}',

  ].join( '\n' );

  var initMaterial =  ( function () {

    var material;
    var textureLoader = new THREE.TextureLoader();

    return function () {

      if ( !!material ) { return material; }

      // TODO
      // Canvas2D で noise 画像を作る
      var nzw = textureLoader.load( VolumetricFire.texturePath + 'nzw.png' );
      nzw.wrapS = THREE.RepeatWrapping;
      nzw.wrapT = THREE.RepeatWrapping;
      nzw.magFilter = THREE.LinearFilter;
      nzw.minFilter = THREE.LinearFilter;

      var fireProfile = textureLoader.load( VolumetricFire.texturePath + 'firetex.png' );
      fireProfile.wrapS = THREE.ClampToEdgeWrapping;
      fireProfile.wrapT = THREE.ClampToEdgeWrapping;
      fireProfile.magFilter = THREE.LinearFilter;
      fireProfile.minFilter = THREE.LinearFilter;

      var uniforms = {
        nzw: {
          type: 't',
          value: nzw
        },
        fireProfile: {
          type: 't',
          value: fireProfile
        },
        time: {
          type: 'f',
          value: 1.0
        }
      };

      material = new THREE.RawShaderMaterial( {
        vertexShader   : vs,
        fragmentShader : fs,
        uniforms       : uniforms,
        side           : THREE.DoubleSide,
        blending       : THREE.AdditiveBlending,
        transparent    : true
      } );

      return material;

    };

  } )();


  var cornerNeighbors = [
    [ 1, 2, 4 ],
    [ 0, 5, 3 ],
    [ 0, 3, 6 ],
    [ 1, 7, 2 ],
    [ 0, 6, 5 ],
    [ 1, 4, 7 ],
    [ 2, 7, 4 ],
    [ 3, 5, 6 ],
  ];

  var incomingEdges = [
    [ -1,  2,  4, -1,  1, -1, -1, -1 ],
    [  5, -1, -1,  0, -1,  3, -1, -1 ],
    [  3, -1, -1,  6, -1, -1,  0, -1 ],
    [ -1,  7,  1, -1, -1, -1, -1,  2 ],
    [  6, -1, -1, -1, -1,  0,  5, -1 ],
    [ -1,  4, -1, -1,  7, -1, -1,  1 ],
    [ -1, -1,  7, -1,  2, -1, -1,  4 ],
    [ -1, -1, -1,  5, -1,  6,  3, -1 ],
  ];

  var VolumetricFire = function ( width, height, depth, sliceSpacing, camera ) {

    this.camera = camera;

    this._sliceSpacing = sliceSpacing;

    var widthHalf  = width  * 0.5;
    var heightHalf = height * 0.5;
    var depthHalf  = depth  * 0.5;

    this._posCorners = [
      new THREE.Vector3( -widthHalf, -heightHalf, -depthHalf ),
      new THREE.Vector3(  widthHalf, -heightHalf, -depthHalf ),
      new THREE.Vector3( -widthHalf,  heightHalf, -depthHalf ),
      new THREE.Vector3(  widthHalf,  heightHalf, -depthHalf ),
      new THREE.Vector3( -widthHalf, -heightHalf,  depthHalf ),
      new THREE.Vector3(  widthHalf, -heightHalf,  depthHalf ),
      new THREE.Vector3( -widthHalf,  heightHalf,  depthHalf ),
      new THREE.Vector3(  widthHalf,  heightHalf,  depthHalf )
    ];
    this._texCorners = [
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 1, 0, 0 ),
      new THREE.Vector3( 0, 1, 0 ),
      new THREE.Vector3( 1, 1, 0 ),
      new THREE.Vector3( 0, 0, 1 ),
      new THREE.Vector3( 1, 0, 1 ),
      new THREE.Vector3( 0, 1, 1 ),
      new THREE.Vector3( 1, 1, 1 )
    ];

    this._viewVector = new THREE.Vector3();


    // TODO
    // still did not figure out, how many vertexes should be...
    // three.jsでは可変にできない、ひとまず多めに用意

    var index    = new Uint16Array ( ( width + height + depth ) * 30 );
    var position = new Float32Array( ( width + height + depth ) * 30 * 3 );
    var tex      = new Float32Array( ( width + height + depth ) * 30 * 3 );

    var geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;
    geometry.setIndex( new THREE.BufferAttribute( index, 1 ) );
    geometry.addAttribute( 'position', new THREE.BufferAttribute( position, 3 ) );
    geometry.addAttribute( 'tex',      new THREE.BufferAttribute( tex,      3 ) );

    var material = initMaterial();

    this.mesh = new THREE.Mesh(
      geometry,
      material
    );

    this.mesh.updateMatrixWorld();

  }

  VolumetricFire.prototype.update = function ( elapsed ) {

    this.updateViewVector();
    this.slice();
    this.updateGeometry();
    this.mesh.material.uniforms.time.value = elapsed;

  }

  VolumetricFire.prototype.updateGeometry = function () {

    this.mesh.geometry.index.array.set( this._indexes );
    this.mesh.geometry.attributes.position.array.set( this._points );
    this.mesh.geometry.attributes.tex.array.set( this._texCoords );

    this.mesh.geometry.index.needsUpdate               = true;
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.attributes.tex.needsUpdate      = true;

  }

  VolumetricFire.prototype.updateViewVector = function () {

    // TODO
    // MVMatrixが前回と同じなら、アップデートしないようにする
    //
    // つまり、カメラの位置とオブジェクトの位置に変化なければ
    // アップデートしないようにする

    var modelViewMatrix = new THREE.Matrix4();

    modelViewMatrix.multiplyMatrices(
      this.camera.matrixWorldInverse,
      this.mesh.matrixWorld
    );

    this._viewVector.set(
      - modelViewMatrix.elements[  2 ],
      - modelViewMatrix.elements[  6 ],
      - modelViewMatrix.elements[ 10 ]
    ).normalize();

  };

  VolumetricFire.prototype.slice = function () {

    this._points    = [];
    this._texCoords = [];
    this._indexes   = [];

    var i;
    var cornerDistance0 = this._posCorners[ 0 ].dot( this._viewVector );

    var cornerDistance = [ cornerDistance0 ];
    var maxCorner = 0;
    var minDistance = cornerDistance0;
    var maxDistance = cornerDistance0;

    for ( i = 1; i < 8; i = ( i + 1 )|0 ) {

      cornerDistance[ i ] = this._posCorners[ i ].dot( this._viewVector );

      if ( cornerDistance[ i ] > maxDistance ) {

        maxCorner = i;
        maxDistance = cornerDistance[ i ];

      }

      if ( cornerDistance[ i ] < minDistance ) {

        minDistance = cornerDistance[ i ];

      }

    }

    // Aligning slices
    var sliceDistance = Math.floor( maxDistance / this._sliceSpacing ) * this._sliceSpacing;

    var activeEdges = [];
    var firstEdge   = 0;
    var nextEdge    = 0;
    var expirations = new PriorityQueue();

    var createEdge = function ( startIndex, endIndex ) {

      if ( nextEdge >= 12 ) { return undefined; }

      var activeEdge = {
          expired    : false,
          startIndex : startIndex,
          endIndex   : endIndex,
          deltaPos   : new THREE.Vector3(),
          deltaTex   : new THREE.Vector3(),
          pos        : new THREE.Vector3(),
          tex        : new THREE.Vector3(),
          cur        : nextEdge
      }

      var range = cornerDistance[ startIndex ] - cornerDistance[ endIndex ];

      if ( range !== 0.0 ) {

        var irange = 1.0 / range;

        activeEdge.deltaPos.subVectors(
          this._posCorners[ endIndex ],
          this._posCorners[ startIndex ]
        ).multiplyScalar( irange );

        activeEdge.deltaTex.subVectors(
          this._texCorners[ endIndex ],
          this._texCorners[ startIndex ]
        ).multiplyScalar( irange );

        var step = cornerDistance[ startIndex ] - sliceDistance;

        activeEdge.pos.addVectors(
          activeEdge.deltaPos.clone().multiplyScalar( step ),
          this._posCorners[ startIndex ]
        );

        activeEdge.tex.addVectors(
          activeEdge.deltaTex.clone().multiplyScalar( step ),
          this._texCorners[ startIndex ]
        );

        activeEdge.deltaPos.multiplyScalar( this._sliceSpacing );
        activeEdge.deltaTex.multiplyScalar( this._sliceSpacing );

      }

      expirations.push( activeEdge, cornerDistance[ endIndex ] );
      activeEdges[ nextEdge++ ] = activeEdge;
      return activeEdge;

    };

    for ( i = 0; i < 3; i = ( i + 1 )|0 ) {

      var activeEdge = createEdge.call( this, maxCorner, cornerNeighbors[ maxCorner ][ i ] );
      activeEdge.prev = ( i + 2 ) % 3;
      activeEdge.next = ( i + 1 ) % 3;

    }

    var nextIndex = 0;

    while ( sliceDistance > minDistance ) {

      while ( expirations.top().priority >= sliceDistance ) {

        var edge = expirations.pop().object;

        if ( edge.expired ) { continue; }

        if (
          edge.endIndex !== activeEdges[ edge.prev ].endIndex &&
          edge.endIndex !== activeEdges[ edge.next ].endIndex
        ) {

          // split this edge.
          edge.expired = true;

          // create two new edges.
          var activeEdge1 = createEdge.call(
            this,
            edge.endIndex,
            incomingEdges[ edge.endIndex ][ edge.startIndex ]
          );
          activeEdge1.prev = edge.prev;
          activeEdges[ edge.prev ].next = nextEdge - 1;
          activeEdge1.next = nextEdge;

          var activeEdge2 = createEdge.call(
            this,
            edge.endIndex,
            incomingEdges[ edge.endIndex ][ activeEdge1.endIndex ]
          );
          activeEdge2.prev = nextEdge - 2;
          activeEdge2.next = edge.next;
          activeEdges[activeEdge2.next].prev = nextEdge - 1;
          firstEdge = nextEdge - 1;

        } else {

          // merge edge.
          var prev;
          var next;

          if ( edge.endIndex === activeEdges[ edge.prev ].endIndex ) {

            prev = activeEdges[ edge.prev ];
            next = edge;

          } else {

            prev = edge;
            next = activeEdges[ edge.next ];

          }

          prev.expired = true;
          next.expired = true;

          // make new edge
          var activeEdge = createEdge.call(
            this,
            edge.endIndex,
            incomingEdges[ edge.endIndex ][ prev.startIndex ]
          );
          activeEdge.prev = prev.prev;
          activeEdges[ activeEdge.prev ].next = nextEdge - 1;
          activeEdge.next = next.next;
          activeEdges[ activeEdge.next ].prev = nextEdge - 1;
          firstEdge = nextEdge - 1;

        }

      }

      var cur = firstEdge;
      var count = 0;

      do {

        ++count;
        var activeEdge = activeEdges[ cur ];
        this._points.push(
          activeEdge.pos.x,
          activeEdge.pos.y,
          activeEdge.pos.z
        );
        this._texCoords.push(
          activeEdge.tex.x,
          activeEdge.tex.y,
          activeEdge.tex.z
        );
        activeEdge.pos.add( activeEdge.deltaPos );
        activeEdge.tex.add( activeEdge.deltaTex );
        cur = activeEdge.next;

      } while ( cur !== firstEdge );

      for ( i = 2; i < count; i = ( i + 1 )|0 ) {

        this._indexes.push(
          nextIndex,
          nextIndex + i - 1,
          nextIndex + i
        );

      }

      nextIndex += count;
      sliceDistance -= this._sliceSpacing;

    }

  };

  VolumetricFire.texturePath = './textures/';

  ///

  var PriorityQueue = function () {

    this.contents = [];
    this.sorted = false;

  };

  PriorityQueue.prototype = {

    sort: function () {

      this.contents.sort();
      this.sorted = true;

    },

    pop: function () {

      if ( !this.sorted ) {

        this.sort();

      }

      return this.contents.pop();

    },

    top : function() {

      if ( !this.sorted ) {

        this.sort();

      }

      return this.contents[ this.contents.length - 1 ];

    },

    push : function( object, priority ) {

      this.contents.push( { object: object, priority: priority } );
      this.sorted = false;

    }

  };

  return VolumetricFire;

} ) );
