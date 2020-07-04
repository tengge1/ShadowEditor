/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { dispatch } from '../../third_party';

import DataView from './DataView2';
import Vertex from './Vertex';
import Texture from './Texture';
import Bone from './Bone';
import HiddenBones from './HiddenBones';
import Animation from './Animation';
import BaseAnimations from './BaseAnimations';
import AnimationBone from './AnimationBone';

/**
 * @author lolking / http://www.lolking.net/models
 * @author tengge / https://github.com/tengge1
 * @param {Object} options 参数
 */
function Model(options) {
    var self = this;
    self.champion = options.champion || "1";
    self.skin = options.skin || 0;
    self.meshUrl = options.meshUrl;
    self.animUrl = options.animUrl;
    self.textureUrl = options.textureUrl;

    self.loaded = false;
    self.animsLoaded = false;

    self.meshes = null;
    self.vertices = null;
    self.indices = null;
    self.transforms = null;
    self.bones = null;
    self.boneLookup = {};
    self.animIndex = -1;
    self.animName = null;
    self.baseAnim = null;
    self.newAnimation = false;
    self.animTime = 0;
    self.tmpMat = mat4.create();
    self.tmpVec = vec4.create();
    self.ANIMATED = true;

    self.dispatch = dispatch('load', 'loadMesh', 'loadTexture', 'loadAnim');

    self.hiddenBones = null;
    var hiddenBones = HiddenBones;
    if (hiddenBones[self.champion] !== undefined) {
        if (hiddenBones[self.champion][self.skin] !== undefined) {
            self.hiddenBones = hiddenBones[self.champion][self.skin];
        }
    }

    self.ambientColor = [.35, .35, .35, 1];
    self.primaryColor = [1, 1, 1, 1];
    self.secondaryColor = [.35, .35, .35, 1];
    self.lightDir1 = vec3.create();
    self.lightDir2 = vec3.create();
    self.lightDir3 = vec3.create();
    vec3.normalize(self.lightDir1, [5, 5, -5]);
    vec3.normalize(self.lightDir2, [5, 5, 5]);
    vec3.normalize(self.lightDir3, [-5, -5, -5]);

    self.texture = null;
    self.geometry = new THREE.BufferGeometry();
    self.material = new THREE.MeshPhongMaterial();

    var promise1 = new Promise(resolve => {
        self.dispatch.on('loadMesh.Model', () => {
            resolve();
        });
    });
    var promise2 = new Promise(resolve => {
        self.dispatch.on('loadTexture.Model', () => {
            resolve();
        });
    });
    var promise3 = new Promise(resolve => {
        self.dispatch.on('loadAnim.Model', () => {
            resolve();
        });
    });
    Promise.all([promise1, promise2, promise3]).then(() => {
        self.dispatch.call('load');
    });
}

Model.prototype.getAnimations = function () {
    if (!this.animations) {
        return null;
    }
    var names = [];
    this.animations.forEach(function (n) {
        names.push(n.name);
    });
    return names;
};

Model.prototype.getAnimation = function (name) {
    var self = this,
        i, animIndex = -1;
    if (!self.animations) {
        return animIndex;
    }
    name = name.toLowerCase();
    if (name === "idle" || name === "attack") {
        var anims = [],
            re = new RegExp(name + "[0-9]*");
        for (i = 0; i < self.animations.length; ++i) {
            if (self.animations[i].name.search(re) === 0) anims.push(i);
        }
        if (anims.length > 0) {
            animIndex = anims[0];
        }
    } else {
        for (i = 0; i < self.animations.length; ++i) {
            if (self.animations[i].name === name) {
                animIndex = i;
                break;
            }
        }
    }
    return animIndex;
};

Model.prototype.setAnimation = function (name) {
    var self = this;
    self.animName = name;
    self.newAnimation = true;
};

Model.prototype.update = function (time) {
    var self = this,
        i, j;

    if (self.animTime === 0) {
        self.animTime = time;
    }

    if (!self.loaded || !self.vertices || !self.animations || self.animations.length === 0) {
        return;
    }

    self.animIndex = self.getAnimation(self.animName);
    if (self.animIndex === -1) {
        self.animIndex = 0;
        self.animName = "idle";
    }
    var baseAnims = BaseAnimations;
    if (baseAnims[self.champion] !== undefined) {
        if (baseAnims[self.champion][self.skin] !== undefined) {
            var baseAnim = baseAnims[self.champion][self.skin],
                baseIndex = -1;

            if (baseAnim[self.animations[self.animIndex].name]) {
                baseIndex = self.getAnimation(baseAnim[self.animations[self.animIndex].name]);
            } else if (baseAnim["all"]) {
                baseIndex = self.getAnimation(baseAnim["all"]);
            }

            if (baseIndex > -1) {
                self.baseAnim = self.animations[baseIndex];
            } else {
                self.baseAnim = null;
            }
        }
    }

    var deltaTime = time - self.animTime;
    var anim = self.animations[self.animIndex];

    if (deltaTime >= anim.duration) {
        self.animTime = time;
        deltaTime = 0;
    }

    if (self.ANIMATED) {
        var timePerFrame = 1e3 / anim.fps;
        var frame = Math.floor(deltaTime / timePerFrame);
        var r = deltaTime % timePerFrame / timePerFrame;
        var hiddenBones = {};
        if (self.hiddenBones) {
            if (self.hiddenBones[anim.name]) {
                hiddenBones = self.hiddenBones[anim.name];
            } else if (self.hiddenBones["all"]) {
                hiddenBones = self.hiddenBones["all"];
            }
        }
        var b;
        if (self.version >= 1) {
            for (i = 0; i < self.bones.length; ++i) {
                b = self.bones[i];
                if (hiddenBones[b.name]) {
                    mat4.identity(self.tmpMat);
                    mat4.scale(self.tmpMat, self.tmpMat, vec3.set(self.tmpVec, 0, 0, 0));
                    mat4.copy(self.transforms[i], self.tmpMat);
                } else if (anim.lookup[b.name] !== undefined) {
                    anim.bones[anim.lookup[b.name]].update(i, frame, r);
                } else if (self.baseAnim && self.baseAnim.lookup[b.name] !== undefined) {
                    self.baseAnim.bones[self.baseAnim.lookup[b.name]].update(i, frame, r);
                } else {
                    if (b.parent !== -1) {
                        AnimationBone.prototype.mulSlimDX(self.transforms[i], b.incrMatrix, self.transforms[b.parent]);
                    } else {
                        mat4.copy(self.transforms[i], b.incrMatrix);
                    }
                }
            }
        } else {
            for (i = 0; i < anim.bones.length; ++i) {
                b = anim.bones[i];
                if (self.boneLookup[b.bone] !== undefined) {
                    b.update(self.boneLookup[b.bone], frame, r);
                } else {
                    var parentBone = anim.bones[i - 1];
                    if (!parentBone) continue;
                    if (parentBone.index + 1 < self.transforms.length) {
                        mat4.copy(self.transforms[parentBone.index + 1], self.transforms[parentBone.index]);
                    }
                    b.index = parentBone.index + 1;
                }
            }
        }
        var numBones = Math.min(self.transforms.length, self.bones.length);
        for (i = 0; i < numBones; ++i) {
            AnimationBone.prototype.mulSlimDX(self.transforms[i], self.bones[i].baseMatrix, self.transforms[i]);
        }
        mat4.identity(self.tmpMat);
        var numVerts = self.vertices.length,
            vec = self.tmpVec,
            position = self.geometry.attributes.position.array,
            normal = self.geometry.attributes.normal.array,
            v, w, m, idx;
        for (i = 0; i < numVerts; ++i) {
            v = self.vertices[i];
            idx = i * 3;
            position[idx] = position[idx + 1] = position[idx + 2] = 0;
            normal[idx] = normal[idx + 1] = normal[idx + 2] = 0;
            for (j = 0; j < 4; ++j) {
                if (v.weights[j] > 0) {
                    w = v.weights[j];
                    m = anim.fps === 1 ? self.tmpMat : self.transforms[v.bones[j]];
                    vec3.transformMat4(vec, v.position, m);
                    position[idx] += vec[0] * w;
                    position[idx + 1] += vec[1] * w;
                    position[idx + 2] += vec[2] * w;
                    vec4.transformMat4(vec, v.normal, m);
                    normal[idx] += vec[0] * w;
                    normal[idx + 1] += vec[1] * w;
                    normal[idx + 2] += vec[2] * w;
                }
            }
        }
        self.geometry.attributes.position.needsUpdate = true;
        self.geometry.attributes.normal.needsUpdate = true;
    }
    if (self.newAnimation) {
        self.newAnimation = false;
    }
};

Model.prototype.load = function () {
    var self = this;
    var loader = new THREE.FileLoader();
    loader.setResponseType('arraybuffer');
    loader.load(self.meshUrl, function (buffer) {
        self.loadMesh(buffer);
    });
};

Model.prototype.loadMesh = function (buffer) {
    if (!buffer) {
        console.error("Bad buffer for DataView");
        return;
    }
    var self = this,
        r = new DataView(buffer),
        i,
        v,
        idx;
    try {
        var magic = r.getUint32();
        if (magic !== 604210091) {
            console.log("Bad magic value");
            return;
        }
    } catch (err) {
        console.warn("Model currently isn't loading! We're sorry and hope to have this fixed soon.");
        console.log(err);
        return;
    }
    self.version = r.getUint32();
    var animFile = r.getString();
    var textureFile = r.getString();
    if (animFile && animFile.length > 0) {
        var loader = new THREE.FileLoader();
        loader.setResponseType('arraybuffer');
        loader.load(self.animUrl, function (buffer) {
            self.loadAnim(buffer);
            self.dispatch.call('loadAnim');
        });
    }
    if (textureFile && textureFile.length > 0) {
        self.texture = new Texture(self, self.textureUrl);
    }
    var numMeshes = r.getUint32();
    if (numMeshes > 0) {
        self.meshes = new Array(numMeshes);
        for (i = 0; i < numMeshes; ++i) {
            var name = r.getString().toLowerCase();
            var vStart = r.getUint32();
            var vCount = r.getUint32();
            var iStart = r.getUint32();
            var iCount = r.getUint32();
            self.meshes[i] = {
                name: name,
                vStart: vStart,
                vCount: vCount,
                iStart: iStart,
                iCount: iCount
            };
        }
    }
    var numVerts = r.getUint32();
    if (numVerts > 0) {
        self.vertices = new Array(numVerts);
        self.vbData = new Float32Array(numVerts * 8);
        var position = [];
        var normal = [];
        var uv = [];
        for (i = 0; i < numVerts; ++i) {
            idx = i * 8;
            self.vertices[i] = v = new Vertex(r);
            self.vbData[idx] = v.position[0];
            self.vbData[idx + 1] = v.position[1];
            self.vbData[idx + 2] = v.position[2];
            self.vbData[idx + 3] = v.normal[0];
            self.vbData[idx + 4] = v.normal[1];
            self.vbData[idx + 5] = v.normal[2];
            self.vbData[idx + 6] = v.u;
            self.vbData[idx + 7] = v.v;

            position.push(v.position[0], v.position[1], v.position[2]);
            normal.push(v.normal[0], v.normal[1], v.normal[2]);
            uv.push(v.u, v.v);
        }
        self.geometry.setAttribute('position',
            new THREE.BufferAttribute(new Float32Array(position), 3));
        self.geometry.setAttribute('normal',
            new THREE.BufferAttribute(new Float32Array(normal), 3));
        self.geometry.setAttribute('uv',
            new THREE.BufferAttribute(new Float32Array(uv), 2));
    }
    var numIndices = r.getUint32();
    if (numIndices > 0) {
        self.indices = new Array(numIndices);
        for (i = 0; i < numIndices; ++i) {
            self.indices[i] = r.getUint16();
        }
        self.geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(self.indices), 1));
    }
    var numBones = r.getUint32();
    if (numBones > 0) {
        self.transforms = new Array(numBones);
        self.bones = new Array(numBones);
        for (i = 0; i < numBones; ++i) {
            self.bones[i] = new Bone(self, i, r);
            if (self.boneLookup[self.bones[i].name] !== undefined) {
                self.bones[i].name = self.bones[i].name + "2";
            }
            self.boneLookup[self.bones[i].name] = i;
            self.transforms[i] = new mat4.create;
        }
    }
    self.loaded = true;
    self.dispatch.call('loadMesh');
};

Model.prototype.loadAnim = function (buffer) {
    if (!buffer) {
        console.error("Bad buffer for DataView");
        return;
    }
    var self = this,
        r = new DataView(buffer),
        i;
    var magic = r.getUint32();
    if (magic !== 604210092) {
        console.log("Bad magic value");
        return;
    }
    var version = r.getUint32();
    if (version >= 2) {
        var compressedData = new Uint8Array(buffer, r.position);
        var data = null;
        try {
            data = pako.inflate(compressedData);
        } catch (err) {
            console.log("Decompression error: " + err);
            return;
        }
        r = new DataView(data.buffer);
    }
    var numAnims = r.getUint32();
    if (numAnims > 0) {
        self.animations = new Array(numAnims);
        for (i = 0; i < numAnims; ++i) {
            self.animations[i] = new Animation(self, r, version);
        }
    }
    self.animsLoaded = true;
};

Model.prototype.on = function (eventName, callback) {
    this.dispatch.on(eventName, callback);
};

export default Model;