'use client';

import React from 'react';
import DecalControl from './DecalControl';
import ModelControl from './ModelControl';
import LightControl from './LightControl';
import SceneControl from './SceneControl';
import { useState } from 'react';
import TextureControl from './TextureControl';
import TextControl from './TextControl';
import CanvasControl from './CanvasControl';

const ControlPanel = ({
    sceneRef,
    uploadedTextureRef,
    dragControlsRef,
    selectedModelRef,
    ambientLightRef,
    spotLightRef,
    pointLightRef,
    directionalLightRef,
    objectRef,
    modelRef,
    modelsRef,
    selectedDecalRef,
    fileAppliedRef,
    textRef,
    decalsRef,
    selectedTextRef,
    draggableobjects,
}) => {
    const [selectedModel, setSelectedModel] = useState(null);
    const [accordion, setAccordion] = useState({
        images: false,
        lights: false,
        scene: false,
        texts: false,
        models: false,
        decals: false,
        canvas: false
    });

    const toggleAccordion = (section) => {
        setAccordion((prev) => {
            const updatedAccordion = Object.keys(prev).reduce((acc, key) => {
                acc[key] = key === section ? !prev[key] : false;
                return acc;
            }, {});
            return updatedAccordion;
        });
    };

    return (
        <div className="relative bg-gray-900 text-white  overflow-hidden">
            <h2 className="text-white text-xl font-bold mb-4 select-none px-4 pt-4">Kontrol Paneli</h2>

            <div className="overflow-y-auto h-[calc(100vh-100px)] p-4 space-y-6">


                <TextureControl
                    accordion={accordion}
                    toggleAccordion={toggleAccordion}
                    modelRef={modelRef}
                />

                <TextControl
                    accordion={accordion}
                    toggleAccordion={toggleAccordion}
                    selectedModelRef={selectedModelRef}
                    sceneRef={sceneRef}
                    textRef={textRef}
                    selectedTextRef={selectedTextRef}
                    modelRef={modelRef}
                />


                <DecalControl
                    accordion={accordion}
                    toggleAccordion={toggleAccordion}
                    uploadedTextureRef={uploadedTextureRef}
                    selectedDecalRef={selectedDecalRef}
                    sceneRef={sceneRef}
                    fileAppliedRef={fileAppliedRef}
                    decalsRef={decalsRef}
                />


                <ModelControl
                    accordion={accordion}
                    toggleAccordion={toggleAccordion}
                    modelsRef={modelsRef}
                    sceneRef={sceneRef}
                    objectRef={objectRef}
                    dragControlsRef={dragControlsRef}
                    selectedModel={selectedModel}
                    selectedModelRef={selectedModelRef}
                    setSelectedModel={setSelectedModel}
                    draggableobjects={draggableobjects}
                />


                <LightControl
                    accordion={accordion}
                    toggleAccordion={toggleAccordion}
                    ambientLightRef={ambientLightRef}
                    directionalLightRef={directionalLightRef}
                    pointLightRef={pointLightRef}
                    spotLightRef={spotLightRef}
                    sceneRef={sceneRef}
                />




                <SceneControl
                    accordion={accordion}
                    toggleAccordion={toggleAccordion}
                    sceneRef={sceneRef}
                />





                <CanvasControl
                    sceneRef={sceneRef}
                    accordion={accordion}
                    toggleAccordion={toggleAccordion}
                />
            </div>
        </div>
    );
};

export default ControlPanel;
