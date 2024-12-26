'use client';

import * as THREE from 'three';
import { addDecal } from './DecalManager';


export const handleMouseDown = (event, mouse, raycaster, selectedModelRef, containerRef, selectedDecalRef, setIsDragEnabled, modelsRef, uploadedTextureRef, sceneRef, selectedFace, controlsRef, decalsRef, cameraRef, modelRef, fileAppliedRef, textRef, selectedTextRef, isModelSelected) => {
    try {
        if (!containerRef.current || !cameraRef.current) {
            console.error("containerRef.current is undefined or null!");
            return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.current.setFromCamera(mouse.current, cameraRef.current);


        const intersectsDecals = raycaster.current.intersectObjects(decalsRef.current, true);

        if (intersectsDecals.length > 0) {
            if (!intersectsDecals.length) console.log('null');
            const selectedDecal = intersectsDecals[0].object;
            selectedDecalRef.current = selectedDecal;
            console.log("Selected Decal:", selectedDecal);
        } else console.log('seçili decal yok')
        const intersectsTexts = raycaster.current.intersectObjects(textRef.current, true);
        if (intersectsTexts.length > 0) {
            if (!intersectsTexts.length) console.log('null');
            const selectedText = intersectsTexts[0].object;
            console.log(selectedText)
            selectedTextRef.current = selectedText;
            console.log("Selected Text:", selectedText);

        } else console.log('seçili text yok')
        // ModelRef içinde bir nesneye tıklanıp tıklanmadığını kontrol et
        const intersects = raycaster.current.intersectObject(modelRef.current);
        if (intersects.length > 0) {
            if (!intersects.length) console.log('null');
            const intersected = intersects[0];
            selectedModelRef.current = intersected.object;
            console.log('Intersected küp:', selectedModelRef.current);

            selectedFace.current = intersected.face.materialIndex;
            if (intersected.object.material[selectedFace.current].map) {
                console.log(intersected.object.material[selectedFace.current].map);
                selectedTextRef.current = intersected.object.material[selectedFace.current].map
            } else console.log('null')

            controlsRef.current.enabled = false;

            // Eğer nesnede bir texture varsa sürükleme kapatılır
            if (intersected.object.material[selectedFace.current].map) {
                setIsDragEnabled(false);
            } else {
                console.log('nesnede texture yok')
            }

            // Seçilen model için decal eklenir
            if (uploadedTextureRef.current) {
                addDecal(intersected.object, intersected, uploadedTextureRef.current, sceneRef, decalsRef, uploadedTextureRef);
            } else { console.log('seçili resim yok') }


            return;
        } else console.log('seçili bir resim yok')



        const intersectsModels = raycaster.current.intersectObjects(modelsRef.current.children, true);

        if (intersectsModels.length > 0) {
            if (!intersectsModels) console.log('null değer')
            const intersected = intersectsModels[0];
            isModelSelected.current = true
            console.log(isModelSelected.current)
            selectedModelRef.current = intersected.object;
            console.log(selectedModelRef.current)

            if (uploadedTextureRef.current) {
                addDecal(intersected.object, intersected, uploadedTextureRef.current, sceneRef, decalsRef, uploadedTextureRef);
                fileAppliedRef.current.value = null
            } else { console.log('yüklenmiş bir resim yok') }
        } else console.log('seçili bir model yok')
    } catch (error) {
        console.log(error)
    }
};

export const handleMouseMove = (event, mouse, raycaster, selectedFace, containerRef, dragging, cameraRef, modelRef) => {
    if (!dragging.current || selectedFace.current === null) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObject(modelRef.current);

    if (intersects.length > 0) {
        if (!intersects) console.log('null');
        const uv = intersects[0].uv;

        if (uv) {
            const materials = modelRef.current.material;
            if (Array.isArray(materials)) {
                const material = materials[selectedFace.current];
                if (material.map) {

                    material.map.wrapS = THREE.ClampToEdgeWrapping;
                    material.map.wrapT = THREE.ClampToEdgeWrapping;


                    const offsetX = -(uv.x - 0.5);
                    const offsetY = -(uv.y - 0.5);

                    material.map.offset.set(offsetX, offsetY);
                    material.map.repeat.set(1, 1);
                    material.map.needsUpdate = true;
                }
            }
        }
    } else console.log('seçili bir model yok')
};

export const handleMouseUp = (dragging, selectedFace, controlsRef) => {
    dragging.current = true
    selectedFace.current = null;
    controlsRef.current.enabled = true;
};
