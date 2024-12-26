'use client'

import React from 'react';
import { handleModelInteraction, updateModelProperty } from '../Managers/ModelManager';
import { useState } from 'react';


const ModelControl = ({ accordion, toggleAccordion, selectedModel, selectedModelRef, setSelectedModel, sceneRef, modelsRef, objectRef, dragControlsRef, draggableobjects }) => {
    const [modelProperties, setModelProperties] = useState({
        araba: { position: { x: 5, y: 0, z: 0 }, scale: { x: 12, y: 12, z: 12 }, color: '#FFDFC4' },
        adam: { position: { x: -5, y: -2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, color: '#FFDFC4' },
        duvar: { position: { x: 0, y: 3, z: 0 }, scale: { x: 1.4, y: 1.2, z: 1.4 }, color: '#ffffff' },
        tisort: { position: { x: 0, y: 3, z: 0 }, scale: { x: 2, y: 2, z: 2 }, color: '#FFDFC4' },
    });


    const handleModelAction = (modelName, action) => {
        if (handleModelInteraction) {
            handleModelInteraction(modelName, action, sceneRef, modelsRef, objectRef, dragControlsRef, selectedModelRef, draggableobjects);
        }
    };

    const updateModelProperties = (property, value) => {
        if (!selectedModel) return;
        setModelProperties((prev) => ({
            ...prev,
            [selectedModel]: {
                ...prev[selectedModel],
                [property]: value,
            },
        }));

        if (updateModelProperty) {
            updateModelProperty(selectedModel, property, value, sceneRef, selectedModelRef);
        }
    };

    const updateModelScale = (axis, value) => {
        setModelProperties((prev) => ({
            ...prev,
            [selectedModel]: {
                ...prev[selectedModel],
                scale: {
                    ...prev[selectedModel].scale,
                    [axis]: value,
                },
            },
        }));
        updateModelProperty(selectedModel, 'scale', {
            ...modelProperties[selectedModel].scale,
            [axis]: value,
        }, sceneRef, selectedModelRef);
    };

    const updateModelPosition = (axis, value) => {
        if (!selectedModel) return;
        setModelProperties((prev) => ({
            ...prev,
            [selectedModel]: {
                ...prev[selectedModel],
                position: {
                    ...prev[selectedModel].position,
                    [axis]: value,
                },
            },
        }));
        if (updateModelProperty) {
            updateModelProperty(selectedModel, 'position', {
                ...modelProperties[selectedModel].position,
                [axis]: value,
            }, sceneRef, selectedModelRef);
        }
    };


    return (
        <div className="bg-[#2a2d3e] p-4 rounded border-l border-b select-none border-gray-500">
            <h3 onClick={() => toggleAccordion('models')} className="cursor-pointer p-1 flex justify-between items-center">
                Model Ayarları <span>{accordion.models ? '−' : '+'}</span>
            </h3>
            {accordion.models && (
                <>
                    <label htmlFor="decalFile" className="block mt-4 font-bold">Model Ekle</label>
                    {/* Model Seçimi */}
                    <select
                        value={selectedModel || ''}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-gray-800 px-4 py-2 rounded mt-6 mb-6"
                    >
                        <option value="" disabled>
                            Model Seçin
                        </option>
                        <option value="araba">Araba</option>
                        <option value="adam">Adam</option>
                        <option value="duvar">Duvar</option>
                        <option value="tisort">Tişört</option>
                    </select>

                    {/* Model Ekle/Kaldır */}
                    <div className="flex space-x-4 mb-4">
                        <button
                            onClick={() => handleModelAction(selectedModel, 'add')}
                            disabled={!selectedModel}
                            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
                        >
                            Model Ekle
                        </button>
                        <button
                            onClick={() => handleModelAction(selectedModel, 'remove')}
                            disabled={!selectedModel}
                            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
                        >
                            Model Kaldır
                        </button>
                    </div>

                    {/* Model Rengi */}
                    <div className="mb-4">
                        <label>Renk</label>
                        <input
                            type="color"
                            value={selectedModel ? modelProperties[selectedModel].color : '#ffffff'}
                            onChange={(e) => updateModelProperties('color', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Model Pozisyonu */}
                    <label>Pozisyon</label>
                    <div className="flex space-x-2 mb-4">
                        {['x', 'y', 'z'].map((axis) => (
                            <div key={axis} className="w-1/3">
                                <label>
                                    {axis.toUpperCase()}: {selectedModel && modelProperties[selectedModel].position[axis]}
                                </label>
                                <input
                                    type="range"
                                    min="-10"
                                    max="10"
                                    step="0.1"
                                    value={selectedModel ? modelProperties[selectedModel].position[axis] : 0}
                                    onChange={(e) => updateModelPosition(axis, parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Model Boyutu */}
                    <label>Boyut</label>
                    <div className="flex space-x-2">
                        {['x', 'y', 'z'].map((axis) => (
                            <div key={axis} className="w-1/3">
                                <label>
                                    {axis.toUpperCase()}: {selectedModel && modelProperties[selectedModel].scale[axis]}
                                </label>
                                <input
                                    type="range"
                                    min="0.01"
                                    max="10"
                                    step="0.01"
                                    value={selectedModel ? modelProperties[selectedModel].scale[axis] : 1}
                                    onChange={(e) => updateModelScale(axis, parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ModelControl;
