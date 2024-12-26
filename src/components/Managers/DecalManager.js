'use client';

import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';

export const addDecal = (model, intersected, texturePath, sceneRef, decalsRef, uploadedTextureRef) => {
    if (!sceneRef.current || !model) {
        console.error('Model veya sahne bulunamadı.');
        return null;
    }
    const texture = new THREE.TextureLoader().load(texturePath);

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        side: THREE.FrontSide

    });

    const position = intersected.point.clone();
    const orientation = new THREE.Euler(); // Yüzeye hizalanması için sıfırla
    const size = new THREE.Vector3(1, 1, 0.1); // Varsayılan boyut (gerekirse kontrol panelinden güncellenir)

    try {
        const decalGeometry = new DecalGeometry(model, position, orientation, size);
        const decalMesh = new THREE.Mesh(decalGeometry, material);
        decalMesh.raycast = THREE.Mesh.prototype.raycast;
        decalMesh.userData.targetModel = model;
        decalMesh.texture = texture;
        decalMesh.userData.position = position;
        sceneRef.current.add(decalMesh);
        // Decal'i decals listesine ekleyin
        decalsRef.current.push(decalMesh);
        uploadedTextureRef.current = null;
        return decalMesh;
    } catch (error) {
        console.error('Decal oluşturulamadı:', error);
        return null;
    }
};

export const updateDecal = (decal, size, position, orientation, sceneRef) => {
    if (!decal || !sceneRef.current) {
        console.error('Decal veya sahne bulunamadı.');
        return;
    }

    if (!decal.userData.targetModel) {
        console.error('Decal üzerinde hedef model (targetModel) bilgisi bulunamadı.');
        return;
    }

    console.log('Güncellenen Decal:', decal);
    console.log('Size:', size);
    console.log('Position (Gelen):', position);
    console.log('Orientation:', orientation);

    // Mevcut pozisyonu alın
    const currentPosition = decal.userData.position.clone();

    // Sadece x ve y eksenlerini güncelle
    const updatedPosition = new THREE.Vector3(
        currentPosition.x + position.x,
        currentPosition.y + position.y,
        currentPosition.z
    );

    console.log('Position (Güncellenmiş):', updatedPosition);


    if (decal.material) decal.material.dispose();
    if (decal.geometry) decal.geometry.dispose();


    const material = new THREE.MeshStandardMaterial({
        map: decal.material.map,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        side: THREE.FrontSide
    });


    // Yeni geometriyi oluştur
    try {
        const newGeometry = new DecalGeometry(
            decal.userData.targetModel,
            updatedPosition,
            new THREE.Euler(orientation.x, orientation.y, orientation.z),
            new THREE.Vector3(size.x, size.y, size.z)
        );

        decal.geometry = newGeometry;
        decal.material = material;
        console.log('Decal başarıyla güncellendi.');
    } catch (error) {
        console.error('DecalGeometry oluşturulurken bir hata oluştu:', error);
    }
};

export const removeDecal = (decal, sceneRef, decalsRef) => {
    if (!decal) {
        console.warn("Kaldırılacak decal bulunamadı.");
        return;
    }


    sceneRef.current.remove(decal);

    if (decalsRef.current) {
        const index = decalsRef.current.indexOf(decal);
        if (index > -1) {
            decalsRef.current.splice(index, 1);
            console.log("Decal decalsRef'ten kaldırıldı.");
        } else {
            console.warn("Decal decalsRef içinde bulunamadı.");
        }
    }

    console.log("Decal başarıyla sahneden ve decalsRef'ten kaldırıldı.");
};

