'use client'

import React from 'react';
import { updateLightSettings, toggleLight } from '../Managers/LightManager';
import { useState } from 'react';

const LightControl = ({ accordion, toggleAccordion, ambientLightRef, directionalLightRef, pointLightRef, spotLightRef, sceneRef }) => {
    const [selectedLightType, setSelectedLightType] = useState('ambient');
    const [lightProperties, setLightProperties] = useState({
        ambient: { intensity: 0.5, color: '#ffffff', position: { x: 0, y: 0, z: 0 } },
        directional: { intensity: 0.5, color: '#ffffff', position: { x: 0, y: 0, z: 0 } },
        point: { intensity: 0.5, color: '#ffffff', position: { x: 0, y: 0, z: 0 } },
        spot: { intensity: 0.5, color: '#ffffff', position: { x: 0, y: 0, z: 0 } },
    });
    const [lightSettings, setLightSettings] = useState({ ambient: true, directional: true, point: true, spot: true });

    const toggleLightt = (lightType) => {
        const newState = !lightSettings[lightType];
        setLightSettings((prev) => ({
            ...prev,
            [lightType]: newState,
        }));
        toggleLight(lightType, newState, ambientLightRef, directionalLightRef, pointLightRef, spotLightRef, sceneRef);
    };

    const updateLightProperty = (property, value) => {
        setLightProperties((prev) => ({
            ...prev,
            [selectedLightType]: {
                ...prev[selectedLightType],
                [property]: value,
            },
        }));
        updateLightSettings(selectedLightType, property, value, sceneRef, ambientLightRef, directionalLightRef, pointLightRef, spotLightRef);
    };

    const updateLightPosition = (axis, value) => {
        setLightProperties((prev) => ({
            ...prev,
            [selectedLightType]: {
                ...prev[selectedLightType],
                position: {
                    ...prev[selectedLightType].position,
                    [axis]: value,
                },
            },
        }));
        updateLightSettings(selectedLightType, 'position', {
            ...lightProperties[selectedLightType].position,
            [axis]: value,
        }, sceneRef, ambientLightRef, directionalLightRef, pointLightRef, spotLightRef);
    };


    return (
        <div className="bg-[#2a2d3e] p-4 rounded border-l border-b select-none border-gray-500">
            <h3 onClick={() => toggleAccordion('lights')} className="cursor-pointer flex p-1 mb-2 justify-between items-center">
                Işık Ayarları <span>{accordion.lights ? '−' : '+'}</span>
            </h3>
            {accordion.lights && (
                <>
                    <div className="flex flex-wrap gap-4 mb-4">
                        {['ambient', 'directional', 'point', 'spot'].map((light) => (
                            <label key={light} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={lightSettings[light]}
                                    onChange={() => {
                                        toggleLightt(light);
                                        if (!lightSettings[light]) {
                                            // Eğer checkbox işaretleniyorsa selectbox'a ekle
                                            setSelectedLightType((prev) =>
                                                prev === '' ? light : prev
                                            );
                                        } else if (selectedLightType === light) {
                                            // Eğer checkbox işareti kaldırılıyorsa ve selectbox'ta seçiliyse ilk aktif ışığı seç
                                            const remainingLights = Object.keys(lightSettings).filter(
                                                (key) => key !== light && lightSettings[key]
                                            );
                                            setSelectedLightType(remainingLights[0] || '');
                                        }
                                    }}
                                />
                                {light.charAt(0).toUpperCase() + light.slice(1)} Light
                            </label>
                        ))}
                    </div>
                    {Object.keys(lightSettings).some((light) => lightSettings[light]) && (
                        <>
                            <label>Seçilen Işık Türü</label>
                            <select
                                value={selectedLightType}
                                onChange={(e) => setSelectedLightType(e.target.value)}
                                className="w-full bg-gray-800 px-4 py-2 rounded mb-4"
                            >
                                {Object.keys(lightSettings)
                                    .filter((light) => lightSettings[light]) // Yalnızca seçili ışık türlerini göster
                                    .map((light) => (
                                        <option key={light} value={light}>
                                            {light.charAt(0).toUpperCase() + light.slice(1)}
                                        </option>
                                    ))}
                            </select>

                            <div className="space-y-4">
                                <label>Parlaklık: {lightProperties[selectedLightType]?.intensity}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    value={lightProperties[selectedLightType]?.intensity || 0}
                                    onChange={(e) => updateLightProperty('intensity', parseFloat(e.target.value))}
                                    className="w-full"
                                />

                                <label>Renk</label>
                                <input
                                    type="color"
                                    value={lightProperties[selectedLightType]?.color || '#ffffff'}
                                    onChange={(e) => updateLightProperty('color', e.target.value)}
                                    className="w-full"
                                />

                                <label>Pozisyon</label>
                                <div className="flex gap-2">
                                    {['x', 'y', 'z'].map((axis) => (
                                        <div key={axis} className="w-1/3">
                                            <label>
                                                {axis.toUpperCase()}: {lightProperties[selectedLightType]?.position[axis] || 0}
                                            </label>
                                            <input
                                                type="range"
                                                min="-10"
                                                max="10"
                                                step="0.1"
                                                value={lightProperties[selectedLightType]?.position[axis] || 0}
                                                onChange={(e) =>
                                                    updateLightPosition(axis, parseFloat(e.target.value))
                                                }
                                                className="w-full"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default LightControl;
