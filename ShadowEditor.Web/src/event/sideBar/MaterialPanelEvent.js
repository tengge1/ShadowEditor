import BaseEvent from '../BaseEvent';
import UI from '../../ui/UI';
import SetMaterialCommand from '../../command/SetMaterialCommand';
import SetMaterialValueCommand from '../../command/SetMaterialValueCommand';
import SetMaterialColorCommand from '../../command/SetMaterialColorCommand';
import SetMaterialMapCommand from '../../command/SetMaterialMapCommand';

/**
 * 材质改变事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function MaterialPanelEvent(app) {
    BaseEvent.call(this, app);

    this.currentObject = null;
    this.copiedMaterial = null;
    this.tabName = '物体';
}

MaterialPanelEvent.prototype = Object.create(BaseEvent.prototype);
MaterialPanelEvent.prototype.constructor = MaterialPanelEvent;

MaterialPanelEvent.prototype.start = function () {
    this.app.on(`selectPropertyTab.${this.id}`, this.onSelectPropertyTab.bind(this));
    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`materialChanged.${this.id}`, this.onMaterialChanged.bind(this));
    this.app.on(`newMaterial.${this.id}`, this.onNewMaterial.bind(this));
    this.app.on(`copyMaterial.${this.id}`, this.onCopyMaterial.bind(this));
    this.app.on(`pasteMaterial.${this.id}`, this.onPasteMaterial.bind(this));
    this.app.on(`updateMaterial.${this.id}`, this.update.bind(this));
    this.app.on(`updateMaterialPanel.${this.id}`, this.refreshUI.bind(this));
};

MaterialPanelEvent.prototype.stop = function () {
    this.app.on(`selectPropertyTab.${this.id}`, null);
    this.app.on(`objectSelected.${this.id}`, null);
    this.app.on(`materialChanged.${this.id}`, null);
    this.app.on(`newMaterial.${this.id}`, null);
    this.app.on(`copyMaterial.${this.id}`, null);
    this.app.on(`pasteMaterial.${this.id}`, null);
    this.app.on(`updateMaterial.${this.id}`, null);
    this.app.on(`updateMaterialPanel.${this.id}`, null);
};

/**
 * 选择材质选项卡
 * @param {*} tabName 
 */
MaterialPanelEvent.prototype.onSelectPropertyTab = function (tabName) {
    this.tabName = tabName;
    if (this.app.editor.selected != null && tabName === '材质') {
        UI.get('materialPanel').dom.style.display = '';
    } else {
        UI.get('materialPanel').dom.style.display = 'none';
    }
};

/**
 * 新建材质
 */
MaterialPanelEvent.prototype.onNewMaterial = function () {
    var materialClass = UI.get('materialClass');
    var editor = this.app.editor;

    var material = new THREE[materialClass.getValue()]();
    editor.execute(new SetMaterialCommand(this.currentObject, material), '新材质：' + materialClass.getValue());
    this.app.call('updateMaterialPanelUI', this);
};

/**
 * 复制材质
 */
MaterialPanelEvent.prototype.onCopyMaterial = function () {
    this.copiedMaterial = this.currentObject.material;
};

/**
 * 粘贴材质
 */
MaterialPanelEvent.prototype.onPasteMaterial = function () {
    var materialClass = UI.get('materialClass');
    var copiedMaterial = this.copiedMaterial;

    if (copiedMaterial === undefined) return;
    editor.execute(new SetMaterialCommand(this.currentObject, copiedMaterial), '粘贴材质：' + materialClass.getValue());
    this.app.call('updateMaterialPanel', this);
    this.app.call('updateMaterial', this);
};

/**
 * 选中物体
 * @param {*} object 
 */
MaterialPanelEvent.prototype.onObjectSelected = function (object) {
    if (this.tabName === '材质' && object != null) {
        UI.get('materialPanel').dom.style.display = '';
    } else {
        UI.get('materialPanel').dom.style.display = 'none';
    }

    if (object && object.material) {
        var objectChanged = object !== this.currentObject;
        this.currentObject = object;
        this.refreshUI(objectChanged);
    } else {
        this.currentObject = null;
    }
};

/**
 * 材质改变
 */
MaterialPanelEvent.prototype.onMaterialChanged = function () {
    this.refreshUI();
};

/**
 * 判断材质面板哪些行应该显示
 */
MaterialPanelEvent.prototype.setRowVisibility = function () {
    var materialNameRow = UI.get('materialNameRow');
    var materialColorRow = UI.get('materialColorRow');
    var materialRoughnessRow = UI.get('materialRoughnessRow');
    var materialMetalnessRow = UI.get('materialMetalnessRow');
    var materialEmissiveRow = UI.get('materialEmissiveRow');
    var materialSpecularRow = UI.get('materialSpecularRow');
    var materialShininessRow = UI.get('materialShininessRow');
    var materialClearCoatRow = UI.get('materialClearCoatRow');
    var materialClearCoatRoughnessRow = UI.get('materialClearCoatRoughnessRow');
    var materialProgramRow = UI.get('materialProgramRow');
    var materialVertexColorsRow = UI.get('materialVertexColorsRow');
    var materialSkinningRow = UI.get('materialSkinningRow');
    var materialMapRow = UI.get('materialMapRow');
    var materialAlphaMapRow = UI.get('materialAlphaMapRow');
    var materialBumpMapRow = UI.get('materialBumpMapRow');
    var materialNormalMapRow = UI.get('materialNormalMapRow');
    var materialDisplacementMapRow = UI.get('materialDisplacementMapRow');
    var materialRoughnessMapRow = UI.get('materialRoughnessMapRow');
    var materialMetalnessMapRow = UI.get('materialMetalnessMapRow');
    var materialSpecularMapRow = UI.get('materialSpecularMapRow');
    var materialEnvMapRow = UI.get('materialEnvMapRow');
    var materialLightMapRow = UI.get('materialLightMapRow');
    var materialAOMapRow = UI.get('materialAOMapRow');
    var materialEmissiveMapRow = UI.get('materialEmissiveMapRow');
    var materialSideRow = UI.get('materialSideRow');
    var materialShadingRow = UI.get('materialShadingRow');
    var materialBlendingRow = UI.get('materialBlendingRow');
    var materialOpacityRow = UI.get('materialOpacityRow');
    var materialTransparentRow = UI.get('materialTransparentRow');
    var materialAlphaTestRow = UI.get('materialAlphaTestRow');
    var materialWireframeRow = UI.get('materialWireframeRow');

    var properties = {
        'name': materialNameRow,
        'color': materialColorRow,
        'roughness': materialRoughnessRow,
        'metalness': materialMetalnessRow,
        'emissive': materialEmissiveRow,
        'specular': materialSpecularRow,
        'shininess': materialShininessRow,
        'clearCoat': materialClearCoatRow,
        'clearCoatRoughness': materialClearCoatRoughnessRow,
        'vertexShader': materialProgramRow,
        'vertexColors': materialVertexColorsRow,
        'skinning': materialSkinningRow,
        'map': materialMapRow,
        'alphaMap': materialAlphaMapRow,
        'bumpMap': materialBumpMapRow,
        'normalMap': materialNormalMapRow,
        'displacementMap': materialDisplacementMapRow,
        'roughnessMap': materialRoughnessMapRow,
        'metalnessMap': materialMetalnessMapRow,
        'specularMap': materialSpecularMapRow,
        'envMap': materialEnvMapRow,
        'lightMap': materialLightMapRow,
        'aoMap': materialAOMapRow,
        'emissiveMap': materialEmissiveMapRow,
        'side': materialSideRow,
        'flatShading': materialShadingRow,
        'blending': materialBlendingRow,
        'opacity': materialOpacityRow,
        'transparent': materialTransparentRow,
        'alphaTest': materialAlphaTestRow,
        'wireframe': materialWireframeRow
    };

    var material = this.currentObject.material;
    for (var property in properties) {
        properties[property].dom.style.display = material[property] !== undefined ? '' : 'none'
    }
};

/**
 * 根据材质变化更新ui
 */
MaterialPanelEvent.prototype.refreshUI = function (resetTextureSelectors) {
    var currentObject = this.currentObject;
    if (!currentObject) return;

    var materialUUID = UI.get('materialUUID');
    var materialName = UI.get('materialName');
    var materialClass = UI.get('materialClass');
    var materialColor = UI.get('materialColor');
    var materialRoughness = UI.get('materialRoughness');
    var materialMetalness = UI.get('materialMetalness');
    var materialEmissive = UI.get('materialEmissive');
    var materialSpecular = UI.get('materialSpecular');
    var materialShininess = UI.get('materialShininess');
    var materialClearCoat = UI.get('materialClearCoat');
    var materialClearCoatRoughness = UI.get('materialClearCoatRoughness');
    var materialVertexColors = UI.get('materialVertexColors');
    var materialSkinning = UI.get('materialSkinning');
    var materialMapEnabled = UI.get('materialMapEnabled');
    var materialMap = UI.get('materialMap');
    var materialAlphaMapEnabled = UI.get('materialAlphaMapEnabled');
    var materialAlphaMap = UI.get('materialAlphaMap');
    var materialBumpMapEnabled = UI.get('materialBumpMapEnabled');
    var materialBumpMap = UI.get('materialBumpMap');
    var materialBumpScale = UI.get('materialBumpScale');
    var materialNormalMapEnabled = UI.get('materialNormalMapEnabled');
    var materialNormalMap = UI.get('materialNormalMap');
    var materialDisplacementMapEnabled = UI.get('materialDisplacementMapEnabled');
    var materialDisplacementMap = UI.get('materialDisplacementMap');
    var materialDisplacementScale = UI.get('materialDisplacementScale');
    var materialRoughnessMapEnabled = UI.get('materialRoughnessMapEnabled');
    var materialRoughnessMap = UI.get('materialRoughnessMap');
    var materialMetalnessMapEnabled = UI.get('materialMetalnessMapEnabled');
    var materialMetalnessMap = UI.get('materialMetalnessMap');
    var materialSpecularMapEnabled = UI.get('materialSpecularMapEnabled');
    var materialSpecularMap = UI.get('materialSpecularMap');
    var materialEnvMapEnabled = UI.get('materialEnvMapEnabled');
    var materialEnvMap = UI.get('materialEnvMap');
    var materialReflectivity = UI.get('materialReflectivity');
    var materialLightMapEnabled = UI.get('materialLightMapEnabled');
    var materialLightMap = UI.get('materialLightMap');
    var materialAOMapEnabled = UI.get('materialAOMapEnabled');
    var materialAOMap = UI.get('materialAOMap');
    var materialAOScale = UI.get('materialAOScale');
    var materialEmissiveMapEnabled = UI.get('materialEmissiveMapEnabled');
    var materialEmissiveMap = UI.get('materialEmissiveMap');
    var materialSide = UI.get('materialSide');
    var materialShading = UI.get('materialShading');
    var materialBlending = UI.get('materialBlending');
    var materialOpacity = UI.get('materialOpacity');
    var materialTransparent = UI.get('materialTransparent');
    var materialAlphaTest = UI.get('materialAlphaTest');
    var materialWireframe = UI.get('materialWireframe');
    var materialWireframeLinewidth = UI.get('materialWireframeLinewidth');

    var material = currentObject.material;

    if (material.uuid !== undefined) {
        materialUUID.setValue(material.uuid);
    }

    if (material.name !== undefined) {
        materialName.setValue(material.name);
    }

    materialClass.setValue(material.type);

    if (material.color !== undefined) {
        materialColor.setHexValue(material.color.getHexString());
    }

    if (material.roughness !== undefined) {
        materialRoughness.setValue(material.roughness);
    }

    if (material.metalness !== undefined) {
        materialMetalness.setValue(material.metalness);
    }

    if (material.emissive !== undefined) {
        materialEmissive.setHexValue(material.emissive.getHexString());
    }

    if (material.specular !== undefined) {
        materialSpecular.setHexValue(material.specular.getHexString());
    }

    if (material.shininess !== undefined) {
        materialShininess.setValue(material.shininess);
    }

    if (material.clearCoat !== undefined) {
        materialClearCoat.setValue(material.clearCoat);
    }

    if (material.clearCoatRoughness !== undefined) {
        materialClearCoatRoughness.setValue(material.clearCoatRoughness);
    }

    if (material.vertexColors !== undefined) {
        materialVertexColors.setValue(material.vertexColors);
    }

    if (material.skinning !== undefined) {
        materialSkinning.setValue(material.skinning);
    }

    if (material.map !== undefined) {
        materialMapEnabled.setValue(material.map !== null);

        if (material.map !== null || resetTextureSelectors) {
            materialMap.setValue(material.map);
        }
    }

    if (material.alphaMap !== undefined) {
        materialAlphaMapEnabled.setValue(material.alphaMap !== null);

        if (material.alphaMap !== null || resetTextureSelectors) {
            materialAlphaMap.setValue(material.alphaMap);
        }
    }

    if (material.bumpMap !== undefined) {
        materialBumpMapEnabled.setValue(material.bumpMap !== null);

        if (material.bumpMap !== null || resetTextureSelectors) {
            materialBumpMap.setValue(material.bumpMap);
        }

        materialBumpScale.setValue(material.bumpScale);
    }

    if (material.normalMap !== undefined) {
        materialNormalMapEnabled.setValue(material.normalMap !== null);

        if (material.normalMap !== null || resetTextureSelectors) {
            materialNormalMap.setValue(material.normalMap);
        }
    }

    if (material.displacementMap !== undefined) {
        materialDisplacementMapEnabled.setValue(material.displacementMap !== null);

        if (material.displacementMap !== null || resetTextureSelectors) {
            materialDisplacementMap.setValue(material.displacementMap);
        }

        materialDisplacementScale.setValue(material.displacementScale);
    }

    if (material.roughnessMap !== undefined) {
        materialRoughnessMapEnabled.setValue(material.roughnessMap !== null);

        if (material.roughnessMap !== null || resetTextureSelectors) {
            materialRoughnessMap.setValue(material.roughnessMap);
        }
    }

    if (material.metalnessMap !== undefined) {
        materialMetalnessMapEnabled.setValue(material.metalnessMap !== null);

        if (material.metalnessMap !== null || resetTextureSelectors) {
            materialMetalnessMap.setValue(material.metalnessMap);
        }
    }

    if (material.specularMap !== undefined) {
        materialSpecularMapEnabled.setValue(material.specularMap !== null);

        if (material.specularMap !== null || resetTextureSelectors) {
            materialSpecularMap.setValue(material.specularMap);
        }
    }

    if (material.envMap !== undefined) {
        materialEnvMapEnabled.setValue(material.envMap !== null);

        if (material.envMap !== null || resetTextureSelectors) {
            materialEnvMap.setValue(material.envMap);
        }
    }

    if (material.reflectivity !== undefined) {
        materialReflectivity.setValue(material.reflectivity);
    }

    if (material.lightMap !== undefined) {
        materialLightMapEnabled.setValue(material.lightMap !== null);

        if (material.lightMap !== null || resetTextureSelectors) {
            materialLightMap.setValue(material.lightMap);
        }
    }

    if (material.aoMap !== undefined) {
        materialAOMapEnabled.setValue(material.aoMap !== null);

        if (material.aoMap !== null || resetTextureSelectors) {
            materialAOMap.setValue(material.aoMap);
        }

        materialAOScale.setValue(material.aoMapIntensity);
    }

    if (material.emissiveMap !== undefined) {
        materialEmissiveMapEnabled.setValue(material.emissiveMap !== null);

        if (material.emissiveMap !== null || resetTextureSelectors) {
            materialEmissiveMap.setValue(material.emissiveMap);
        }
    }

    if (material.side !== undefined) {
        materialSide.setValue(material.side);
    }

    if (material.flatShading !== undefined) {
        materialShading.setValue(material.flatShading);
    }

    if (material.blending !== undefined) {
        materialBlending.setValue(material.blending);
    }

    if (material.opacity !== undefined) {
        materialOpacity.setValue(material.opacity);
    }

    if (material.transparent !== undefined) {
        materialTransparent.setValue(material.transparent);
    }

    if (material.alphaTest !== undefined) {
        materialAlphaTest.setValue(material.alphaTest);
    }

    if (material.wireframe !== undefined) {
        materialWireframe.setValue(material.wireframe);
    }

    if (material.wireframeLinewidth !== undefined) {
        materialWireframeLinewidth.setValue(material.wireframeLinewidth);
    }

    this.setRowVisibility();
};

/**
 * 根据ui变化更新材质
 */
MaterialPanelEvent.prototype.update = function () {
    var editor = this.app.editor;

    var currentObject = this.currentObject;

    var materialUUID = UI.get('materialUUID');
    var materialName = UI.get('materialName');
    var materialClass = UI.get('materialClass');
    var materialColor = UI.get('materialColor');
    var materialRoughness = UI.get('materialRoughness');
    var materialMetalness = UI.get('materialMetalness');
    var materialEmissive = UI.get('materialEmissive');
    var materialSpecular = UI.get('materialSpecular');
    var materialShininess = UI.get('materialShininess');
    var materialClearCoat = UI.get('materialClearCoat');
    var materialClearCoatRoughness = UI.get('materialClearCoatRoughness');
    var materialVertexColors = UI.get('materialVertexColors');
    var materialSkinning = UI.get('materialSkinning');
    var materialMapEnabled = UI.get('materialMapEnabled');
    var materialMap = UI.get('materialMap');
    var materialAlphaMapEnabled = UI.get('materialAlphaMapEnabled');
    var materialAlphaMap = UI.get('materialAlphaMap');
    var materialBumpMapEnabled = UI.get('materialBumpMapEnabled');
    var materialBumpMap = UI.get('materialBumpMap');
    var materialBumpScale = UI.get('materialBumpScale');
    var materialNormalMapEnabled = UI.get('materialNormalMapEnabled');
    var materialNormalMap = UI.get('materialNormalMap');
    var materialDisplacementMapEnabled = UI.get('materialDisplacementMapEnabled');
    var materialDisplacementMap = UI.get('materialDisplacementMap');
    var materialDisplacementScale = UI.get('materialDisplacementScale');
    var materialRoughnessMapEnabled = UI.get('materialRoughnessMapEnabled');
    var materialRoughnessMap = UI.get('materialRoughnessMap');
    var materialMetalnessMapEnabled = UI.get('materialMetalnessMapEnabled');
    var materialMetalnessMap = UI.get('materialMetalnessMap');
    var materialSpecularMapEnabled = UI.get('materialSpecularMapEnabled');
    var materialSpecularMap = UI.get('materialSpecularMap');
    var materialEnvMapEnabled = UI.get('materialEnvMapEnabled');
    var materialEnvMap = UI.get('materialEnvMap');
    var materialReflectivity = UI.get('materialReflectivity');
    var materialLightMapEnabled = UI.get('materialLightMapEnabled');
    var materialLightMap = UI.get('materialLightMap');
    var materialAOMapEnabled = UI.get('materialAOMapEnabled');
    var materialAOMap = UI.get('materialAOMap');
    var materialAOScale = UI.get('materialAOScale');
    var materialEmissiveMapEnabled = UI.get('materialEmissiveMapEnabled');
    var materialEmissiveMap = UI.get('materialEmissiveMap');
    var materialSide = UI.get('materialSide');
    var materialShading = UI.get('materialShading');
    var materialBlending = UI.get('materialBlending');
    var materialOpacity = UI.get('materialOpacity');
    var materialTransparent = UI.get('materialTransparent');
    var materialAlphaTest = UI.get('materialAlphaTest');
    var materialWireframe = UI.get('materialWireframe');
    var materialWireframeLinewidth = UI.get('materialWireframeLinewidth');

    var object = currentObject;

    var geometry = object.geometry;
    var material = object.material;

    var textureWarning = false;
    var objectHasUvs = false;

    if (object instanceof THREE.Sprite) objectHasUvs = true;
    if (geometry instanceof THREE.Geometry && geometry.faceVertexUvs[0].length > 0) objectHasUvs = true;
    if (geometry instanceof THREE.BufferGeometry && geometry.attributes.uv !== undefined) objectHasUvs = true;

    if (material) {
        if (material.uuid !== undefined && material.uuid !== materialUUID.getValue()) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'uuid', materialUUID.getValue()));
        }

        if (material instanceof THREE[materialClass.getValue()] === false) {
            material = new THREE[materialClass.getValue()]();

            editor.execute(new SetMaterialCommand(currentObject, material), '新材质：' + materialClass.getValue());
            // TODO Copy other references in the scene graph
            // keeping name and UUID then.
            // Also there should be means to create a unique
            // copy for the current object explicitly and to
            // attach the current material to other objects.
        }

        if (material.color !== undefined && material.color.getHex() !== materialColor.getHexValue()) {
            editor.execute(new SetMaterialColorCommand(currentObject, 'color', materialColor.getHexValue()));
        }

        if (material.roughness !== undefined && Math.abs(material.roughness - materialRoughness.getValue()) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'roughness', materialRoughness.getValue()));
        }

        if (material.metalness !== undefined && Math.abs(material.metalness - materialMetalness.getValue()) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'metalness', materialMetalness.getValue()));
        }

        if (material.emissive !== undefined && material.emissive.getHex() !== materialEmissive.getHexValue()) {
            editor.execute(new SetMaterialColorCommand(currentObject, 'emissive', materialEmissive.getHexValue()));
        }

        if (material.specular !== undefined && material.specular.getHex() !== materialSpecular.getHexValue()) {
            editor.execute(new SetMaterialColorCommand(currentObject, 'specular', materialSpecular.getHexValue()));
        }

        if (material.shininess !== undefined && Math.abs(material.shininess - materialShininess.getValue()) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'shininess', materialShininess.getValue()));
        }

        if (material.clearCoat !== undefined && Math.abs(material.clearCoat - materialClearCoat.getValue()) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'clearCoat', materialClearCoat.getValue()));
        }

        if (material.clearCoatRoughness !== undefined && Math.abs(material.clearCoatRoughness - materialClearCoatRoughness.getValue()) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'clearCoatRoughness', materialClearCoatRoughness.getValue()));
        }

        if (material.vertexColors !== undefined) {
            var vertexColors = parseInt(materialVertexColors.getValue());

            if (material.vertexColors !== vertexColors) {
                editor.execute(new SetMaterialValueCommand(currentObject, 'vertexColors', vertexColors));
            }
        }

        if (material.skinning !== undefined && material.skinning !== materialSkinning.getValue()) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'skinning', materialSkinning.getValue()));
        }

        if (material.map !== undefined) {
            var mapEnabled = materialMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var map = mapEnabled ? materialMap.getValue() : null;
                if (material.map !== map) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'map', map));
                }
            } else {
                if (mapEnabled) textureWarning = true;
            }
        }

        if (material.alphaMap !== undefined) {
            var mapEnabled = materialAlphaMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var alphaMap = mapEnabled ? materialAlphaMap.getValue() : null;

                if (material.alphaMap !== alphaMap) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'alphaMap', alphaMap));
                }
            } else {
                if (mapEnabled) textureWarning = true;
            }
        }

        if (material.bumpMap !== undefined) {
            var bumpMapEnabled = materialBumpMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var bumpMap = bumpMapEnabled ? materialBumpMap.getValue() : null;

                if (material.bumpMap !== bumpMap) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'bumpMap', bumpMap));
                }

                if (material.bumpScale !== materialBumpScale.getValue()) {
                    editor.execute(new SetMaterialValueCommand(currentObject, 'bumpScale', materialBumpScale.getValue()));
                }
            } else {
                if (bumpMapEnabled) textureWarning = true;
            }
        }

        if (material.normalMap !== undefined) {
            var normalMapEnabled = materialNormalMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var normalMap = normalMapEnabled ? materialNormalMap.getValue() : null;

                if (material.normalMap !== normalMap) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'normalMap', normalMap));
                }
            } else {
                if (normalMapEnabled) textureWarning = true;
            }
        }

        if (material.displacementMap !== undefined) {
            var displacementMapEnabled = materialDisplacementMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var displacementMap = displacementMapEnabled ? materialDisplacementMap.getValue() : null;

                if (material.displacementMap !== displacementMap) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'displacementMap', displacementMap));
                }

                if (material.displacementScale !== materialDisplacementScale.getValue()) {
                    editor.execute(new SetMaterialValueCommand(currentObject, 'displacementScale', materialDisplacementScale.getValue()));
                }
            } else {
                if (displacementMapEnabled) textureWarning = true;
            }

        }

        if (material.roughnessMap !== undefined) {
            var roughnessMapEnabled = materialRoughnessMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var roughnessMap = roughnessMapEnabled ? materialRoughnessMap.getValue() : null;

                if (material.roughnessMap !== roughnessMap) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'roughnessMap', roughnessMap));
                }
            } else {
                if (roughnessMapEnabled) textureWarning = true;
            }
        }

        if (material.metalnessMap !== undefined) {
            var metalnessMapEnabled = materialMetalnessMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var metalnessMap = metalnessMapEnabled ? materialMetalnessMap.getValue() : null;

                if (material.metalnessMap !== metalnessMap) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'metalnessMap', metalnessMap));
                }
            } else {
                if (metalnessMapEnabled) textureWarning = true;
            }
        }

        if (material.specularMap !== undefined) {
            var specularMapEnabled = materialSpecularMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var specularMap = specularMapEnabled ? materialSpecularMap.getValue() : null;

                if (material.specularMap !== specularMap) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'specularMap', specularMap));
                }
            } else {
                if (specularMapEnabled) textureWarning = true;
            }
        }

        if (material.envMap !== undefined) {
            var envMapEnabled = materialEnvMapEnabled.getValue() === true;
            var envMap = envMapEnabled ? materialEnvMap.getValue() : null;

            if (material.envMap !== envMap) {
                editor.execute(new SetMaterialMapCommand(currentObject, 'envMap', envMap));
            }
        }

        if (material.reflectivity !== undefined) {
            var reflectivity = materialReflectivity.getValue();

            if (material.reflectivity !== reflectivity) {
                editor.execute(new SetMaterialValueCommand(currentObject, 'reflectivity', reflectivity));
            }
        }

        if (material.lightMap !== undefined) {
            var lightMapEnabled = materialLightMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var lightMap = lightMapEnabled ? materialLightMap.getValue() : null;

                if (material.lightMap !== lightMap) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'lightMap', lightMap));
                }
            } else {
                if (lightMapEnabled) textureWarning = true;
            }
        }

        if (material.aoMap !== undefined) {
            var aoMapEnabled = materialAOMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var aoMap = aoMapEnabled ? materialAOMap.getValue() : null;

                if (material.aoMap !== aoMap) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'aoMap', aoMap));
                }

                if (material.aoMapIntensity !== materialAOScale.getValue()) {
                    editor.execute(new SetMaterialValueCommand(currentObject, 'aoMapIntensity', materialAOScale.getValue()));
                }
            } else {
                if (aoMapEnabled) textureWarning = true;
            }
        }

        if (material.emissiveMap !== undefined) {
            var emissiveMapEnabled = materialEmissiveMapEnabled.getValue() === true;

            if (objectHasUvs) {
                var emissiveMap = emissiveMapEnabled ? materialEmissiveMap.getValue() : null;

                if (material.emissiveMap !== emissiveMap) {
                    editor.execute(new SetMaterialMapCommand(currentObject, 'emissiveMap', emissiveMap));
                }
            } else {
                if (emissiveMapEnabled) textureWarning = true;
            }
        }

        if (material.side !== undefined) {
            var side = parseInt(materialSide.getValue());

            if (material.side !== side) {
                editor.execute(new SetMaterialValueCommand(currentObject, 'side', side));
            }
        }

        if (material.flatShading !== undefined) {
            var flatShading = materialShading.getValue();

            if (material.flatShading != flatShading) {
                editor.execute(new SetMaterialValueCommand(currentObject, 'flatShading', flatShading, currentMaterialSlot));
            }
        }

        if (material.blending !== undefined) {
            var blending = parseInt(materialBlending.getValue());

            if (material.blending !== blending) {
                editor.execute(new SetMaterialValueCommand(currentObject, 'blending', blending));
            }
        }

        if (material.opacity !== undefined && Math.abs(material.opacity - materialOpacity.getValue()) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'opacity', materialOpacity.getValue()));
        }

        if (material.transparent !== undefined && material.transparent !== materialTransparent.getValue()) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'transparent', materialTransparent.getValue()));
        }

        if (material.alphaTest !== undefined && Math.abs(material.alphaTest - materialAlphaTest.getValue()) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'alphaTest', materialAlphaTest.getValue()));
        }

        if (material.wireframe !== undefined && material.wireframe !== materialWireframe.getValue()) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'wireframe', materialWireframe.getValue()));
        }

        if (material.wireframeLinewidth !== undefined && Math.abs(material.wireframeLinewidth - materialWireframeLinewidth.getValue()) >= 0.01) {
            editor.execute(new SetMaterialValueCommand(currentObject, 'wireframeLinewidth', materialWireframeLinewidth.getValue()));
        }

        this.refreshUI();
    }

    if (textureWarning) {
        console.warn("Can't set texture, model doesn't have texture coordinates");
    }
};

export default MaterialPanelEvent;