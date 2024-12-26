'use client';

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';


export const addImageToFace = (image, faceName, scaleX, scaleY, modelRef) => {
    if (!modelRef.current || !modelRef.current.material) return;


    const faceIndices = {
        front: 4,
        back: 5,
        top: 2,
        bottom: 3,
        right: 0,
        left: 1,
    };

    const faceIndex = faceIndices[faceName];
    if (faceIndex === undefined) return;

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(image.src, () => {
        texture.name = 'resim';
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        // Resmin boyutunu ayarla
        texture.repeat.set(scaleX, scaleY);

        const materials = modelRef.current.material;

        // Malzeme dizisinin belirtilen yüzeyine dokuyu uygula
        if (Array.isArray(materials)) {
            materials[faceIndex].map = texture;
            materials[faceIndex].needsUpdate = true;
            materials[faceIndex].transparent = true;
            materials[faceIndex].alphaTest = 0.5; // Boş alanları şeffaf yap
        }
    });
};

export const updateModelProperty = (modelName, property, value, sceneRef, selectedModelRef) => {
    if (!sceneRef.current) {
        console.error('Scene is not initialized.');
        return;
    }
    console.log(selectedModelRef)
    const selectedObject = selectedModelRef.current
    if (!selectedObject) {
        console.warn(`No object with the name "${modelName}" found in the scene to update.`);
        return;
    }

    if (property === 'position') {
        const { x, y, z } = value;
        selectedObject.position.set(
            x !== undefined ? x : selectedObject.position.x,
            y !== undefined ? y : selectedObject.position.y,
            z !== undefined ? z : selectedObject.position.z
        );
        console.log(`${modelName} position updated to:`, value);
    } else if (property === 'color') {
        if (selectedObject.material || selectedObject.isGroup) {
            selectedObject.traverse((child) => {
                if (child.isMesh && child.material) {
                    if (Array.isArray(child.material)) {

                        child.material.forEach((material) => {
                            material.color.set(value);
                            material.needsUpdate = true;
                        });
                    } else {
                        child.material.color.set(value);
                        child.material.needsUpdate = true;
                    }
                }
            });
            console.log(`${modelName} color updated to: ${value}`);
        } else {
            console.warn(`Material not found or the object "${modelName}" is not a mesh.`);
        }
    } else if (property === 'scale') {
        const { x, y, z } = value;
        selectedObject.scale.set(
            x !== undefined ? x : selectedObject.scale.x,
            y !== undefined ? y : selectedObject.scale.y,
            z !== undefined ? z : selectedObject.scale.z
        );
        console.log(`${modelName} scale updated to:`, value);
    } else {
        console.warn(`Unknown property "${property}" for model "${modelName}".`);
    }
};

export const handleModelInteraction = (modelName, action, sceneRef, modelsRef, objectRef, dragControlsRef, selectedModelRef, draggableObjects) => {
    const loader = new OBJLoader();
    const modelPaths = {
        araba: 'models/78004.obj',
        adam: 'models/man.obj',
        duvar: 'models/farmwall.obj',
        tisort: 'models/tisort.obj'
    };
    const modelPath = modelPaths[modelName];
    if (!modelPath) return;

    loader.load(
        modelPath,
        function (object) {
            if (action === 'add') {
                switch (modelName) {
                    case 'araba':
                        object.position.set(5, 0, 0);
                        object.scale.set(12, 12, 12);
                        object.rotation.x = -Math.PI / 2;
                        object.rotation.z = -Math.PI / 5;
                        break;
                    case 'adam':
                        object.position.set(-5, -2, 0);
                        object.scale.set(1, 1, 1);
                        object.rotation.y = -Math.PI;
                        break;
                    case 'duvar':
                        object.position.set(0, 3, 0);
                        object.scale.set(0.01, 0.01, 0.01);
                        break;
                    case 'tisort':
                        object.position.set(0, -12, 0);
                        object.scale.set(2, 2, 2);
                        break;
                    default:
                        console.warn(`Unknown model: ${modelName}`);
                        break;
                }

                object.name = modelName;
                console.log(object)
                sceneRef.current.add(object);
                modelsRef.current.add(object);
                objectRef.current = object;
                console.log(object.children[0])
                draggableObjects.push(object)
                if (modelName === "tisort") {
                    addDecalToTisort(object.children[0], sceneRef);
                    console.log(modelName)
                } else {
                    console.warn(
                        `Model '${modelName}' malzeme formatı uygun değil, decal eklenmedi.`
                    );
                }
            } if (action === 'remove') {
                console.log(selectedModelRef.current);
                const selectedObject = sceneRef.current.getObjectByName(selectedModelRef.current.name);

                if (!selectedObject) {
                    console.log("Object not found in scene.");
                    return;
                }

                sceneRef.current.traverse((child) => {
                    if (child === selectedObject) {
                        console.log("Removing object:", child);
                        child.parent.remove(child);
                    }
                });

                if (dragControlsRef.current) {
                    const index = dragControlsRef.current.objects.findIndex((obj) => obj.uuid === selectedObject.uuid);
                    if (index > -1) {
                        dragControlsRef.current.objects.splice(index, 1);
                        console.log("Object removed from drag controls.");
                    } else {
                        console.log("Object not found in drag controls.");
                    }
                }
            }
        },
        undefined,
        function (error) {
            console.log('Error loading model:', error);
        }
    );
};

export const addDecalToTisort = (tisortModel, sceneRef) => {

    const position = new THREE.Vector3(0, 1, 0);
    const orientation = new THREE.Euler();
    const size = new THREE.Vector3(1, 1, 1);
    const decalGeometry = new DecalGeometry(
        tisortModel,
        position,
        orientation,
        size
    );


    const decalMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        side: THREE.DoubleSide
    });

    const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);
    decalMesh.name = "decal_front";
    console.log(tisortModel)

    tisortModel.userData.decalMesh = decalMesh;
    sceneRef.current.add(decalMesh);

    console.log("Tişört modeline decal geometry eklendi.");
};




