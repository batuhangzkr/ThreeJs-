'use client';

import * as THREE from 'three';

export const updateLightSettings = (lightType, property, value, sceneRef, ambientLightRef, directionalLightRef, pointLightRef, spotLightRef) => {
    const lightRefs = {
        ambient: ambientLightRef.current,
        directional: directionalLightRef.current,
        point: pointLightRef.current,
        spot: spotLightRef.current,
    };

    const light = lightRefs[lightType];
    if (!light) return;

    if (property === 'intensity') {
        light.intensity = parseFloat(value);
    } else if (property === 'color') {
        light.color = new THREE.Color(value);
    } else if (property === 'position') {
        light.position.set(value.x || light.position.x, value.y || light.position.y, value.z || light.position.z);
    }
    sceneRef.current.add(light)
};

export const toggleLight = (lightType, add, ambientLightRef, directionalLightRef, pointLightRef, spotLightRef, sceneRef) => {
    const lightRefs = {
        ambient: ambientLightRef.current,
        directional: directionalLightRef.current,
        point: pointLightRef.current,
        spot: spotLightRef.current,
    };

    const light = lightRefs[lightType];
    if (!light) return;

    if (add) {
        // Işığı sahneye ekle
        sceneRef.current.add(light);
    } else {
        // Işığı sahneden kaldır
        sceneRef.current.remove(light);
    }

};



