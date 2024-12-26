import * as THREE from 'three'

export const updateSceneColor = (color, sceneRef) => {
    if (sceneRef.current) {
        sceneRef.current.background = new THREE.Color(color);
    }
};