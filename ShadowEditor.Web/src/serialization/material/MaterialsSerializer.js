import BaseSerializer from '../BaseSerializer';

import LineBasicMaterialSerializer from './LineBasicMaterialSerializer';
import LineDashedMaterialSerializer from './LineDashedMaterialSerializer';
import MeshBasicMaterialSerializer from './MeshBasicMaterialSerializer';
import MeshDepthMaterialSerializer from './MeshDepthMaterialSerializer';
import MeshDistanceMaterialSerializer from './MeshDistanceMaterialSerializer';
import MeshFaceMaterialSerializer from './MeshFaceMaterialSerializer';
import MeshLambertMaterialSerializer from './MeshLambertMaterialSerializer';
import MeshNormalMaterialSerializer from './MeshNormalMaterialSerializer';
import MeshPhongMaterialSerializer from './MeshPhongMaterialSerializer';
import MeshPhysicalMaterialSerializer from './MeshPhysicalMaterialSerializer';
import MeshStandardMaterialSerializer from './MeshStandardMaterialSerializer';
import MeshToonMaterialSerializer from './MeshToonMaterialSerializer';
import MultiMaterialSerializer from './MultiMaterialSerializer';
import ParticleBasicMaterialSerializer from './ParticleBasicMaterialSerializer';
import ParticleSystemMaterialSerializer from './ParticleSystemMaterialSerializer';
import PointCloudMaterialSerializer from './PointCloudMaterialSerializer';
import PointsMaterialSerializer from './PointsMaterialSerializer';
import RawShaderMaterialSerializer from './RawShaderMaterialSerializer';
import ShaderMaterialSerializer from './ShaderMaterialSerializer';
import ShadowMaterialSerializer from './ShadowMaterialSerializer';
import SpriteCanvasMaterialSerializer from './SpriteCanvasMaterialSerializer';
import SpriteMaterialSerializer from './SpriteMaterialSerializer';

/**
 * MaterialsSerializer
 */
function MaterialsSerializer() {
    BaseSerializer.call(this);
}

MaterialsSerializer.prototype = Object.create(BaseSerializer.prototype);
MaterialsSerializer.prototype.constructor = MaterialsSerializer;

MaterialsSerializer.prototype.toJSON = function (obj) {
    var json = null;

    if (obj instanceof THREE.LineBasicMaterial) {
        json = (new LineBasicMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.LineDashedMaterial) {
        json = (new LineDashedMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MeshBasicMaterial) {
        json = (new MeshBasicMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MeshDepthMaterial) {
        json = (new MeshDepthMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MeshDistanceMaterial) {
        json = (new MeshDistanceMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MeshFaceMaterial) {
        json = (new MeshFaceMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MeshLambertMaterial) {
        json = (new MeshLambertMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MeshNormalMaterial) {
        json = (new MeshNormalMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MeshPhongMaterial) {
        json = (new MeshPhongMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MeshPhysicalMaterial) {
        json = (new MeshPhysicalMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MeshStandardMaterial) {
        json = (new MeshStandardMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MeshToonMaterial) {
        json = (new MeshToonMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.MultiMaterial) {
        json = (new MultiMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.ParticleBasicMaterial) {
        json = (new ParticleBasicMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.ParticleSystemMaterial) {
        json = (new ParticleSystemMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.PointCloudMaterial) {
        json = (new PointCloudMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.PointsMaterial) {
        json = (new PointsMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.RawShaderMaterial) {
        json = (new RawShaderMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.ShaderMaterial) {
        json = (new ShaderMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.ShadowMaterial) {
        json = (new ShadowMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.SpriteCanvasMaterial) {
        json = (new SpriteCanvasMaterialSerializer()).toJSON(obj);
    } else if (obj instanceof THREE.SpriteMaterial) {
        json = (new SpriteMaterialSerializer()).toJSON(obj);
    } else {
        console.warn(`MaterialsSerializer: 不支持的材质类型${obj.type}。`);
    }

    return json;
};

MaterialsSerializer.prototype.fromJSON = function (json) {
    var obj = null;

    if (json.type === 'LineBasicMaterial') {
        obj = (new LineBasicMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'LineDashedMaterial') {
        obj = (new LineDashedMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MeshBasicMaterial') {
        obj = (new MeshBasicMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MeshDepthMaterial') {
        obj = (new MeshDepthMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MeshDistanceMaterial') {
        obj = (new MeshDistanceMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MeshFaceMaterial') {
        obj = (new MeshFaceMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MeshLambertMaterial') {
        obj = (new MeshLambertMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MeshNormalMaterial') {
        obj = (new MeshNormalMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MeshPhongMaterial') {
        obj = (new MeshPhongMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MeshPhysicalMaterial') {
        obj = (new MeshPhysicalMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MeshStandardMaterial') {
        obj = (new MeshStandardMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MeshToonMaterial') {
        obj = (new MeshToonMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'MultiMaterial') {
        obj = (new MultiMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'ParticleBasicMaterial') {
        obj = (new ParticleBasicMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'ParticleSystemMaterial') {
        obj = (new ParticleSystemMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'PointCloudMaterial') {
        obj = (new PointCloudMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'PointsMaterial') {
        obj = (new PointsMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'RawShaderMaterial') {
        obj = (new RawShaderMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'ShaderMaterial') {
        obj = (new ShaderMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'ShadowMaterial') {
        obj = (new ShadowMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'SpriteCanvasMaterial') {
        obj = (new SpriteCanvasMaterialSerializer()).fromJSON(json);
    } else if (json.type === 'SpriteMaterial') {
        obj = (new SpriteMaterialSerializer()).fromJSON(json);
    } else {
        console.warn(`MaterialsSerializer: 不支持的材质类型${json.type}。`);
    }

    return obj;
};

export default MaterialsSerializer;