'use client'
import React from 'react';
import { removeDecal, updateDecal } from '../Managers/DecalManager';
import { useState, useEffect } from 'react';

const DecalControl = ({ accordion, toggleAccordion, uploadedTextureRef, selectedDecalRef, sceneRef, fileAppliedRef, decalsRef }) => {

    const [decalSettings, setDecalSettings] = useState({
        size: { x: 1, y: 1, z: 1 },
        position: { x: 0, y: 0, z: 0 },
        orientation: { x: 0, y: 0, z: 0 },
    });

    console.log(selectedDecalRef)
    const handleDecalUpload = (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.log("Dosya seçilmedi!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const image = e.target.result;

            uploadedTextureRef.current = image;
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateDecal = () => {
        console.log(selectedDecalRef.current)
        if (!selectedDecalRef.current) {
            console.warn("Seçili bir decal yok");
            return;
        }

        const { size, position, orientation } = decalSettings;

        updateDecal(
            selectedDecalRef.current,
            size,
            position,
            orientation,
            sceneRef
        );
    };
    const decalRemove = () => {
        removeDecal(selectedDecalRef.current, sceneRef, decalsRef)
    }
    useEffect(() => {
        if (fileAppliedRef.current) {
            fileAppliedRef.current.value = '';
        }
    }, [fileAppliedRef]);

    return (
        <div className="bg-[#2a2d3e] p-4 rounded border-l border-b select-none border-gray-500">
            <h3
                onClick={() => toggleAccordion('decals')}
                className="cursor-pointer p-1 flex justify-between items-center"
            >
                Decal Kontrol <span>{accordion.decals ? '−' : '+'}</span>
            </h3>
            {accordion.decals && (
                <div>
                    {/* Decal Yükleme */}
                    <div className="mb-4">
                        <label htmlFor="decalFile" className="block mt-3 mb-2">Doku Yükle:</label>
                        <input
                            ref={fileAppliedRef}
                            id="decalFile"
                            type="file"
                            accept="image/*"
                            onChange={handleDecalUpload}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded"
                        />
                    </div>

                    {/* Decal Ayarları */}
                    <h4 className="text-lg font-bold mb-4">Seçili Decal Ayarları</h4>
                    <div className="space-y-4">
                        {/* Boyut Ayarları */}
                        <div>
                            <label>Boyut</label>
                            <div className="flex gap-2">
                                {['x', 'y'].map((axis) => (
                                    <div key={axis} className="w-1/2">
                                        <label>{axis.toUpperCase()}: {decalSettings.size[axis].toFixed(2)}</label>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="5"
                                            step="0.1"
                                            value={decalSettings.size[axis]}
                                            onChange={(e) => {
                                                setDecalSettings((prev) => ({
                                                    ...prev,
                                                    size: { ...prev.size, [axis]: parseFloat(e.target.value) },
                                                }));
                                                if (selectedDecalRef.current) {
                                                    handleUpdateDecal();
                                                }
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pozisyon Ayarları */}
                        <div>
                            <label>Pozisyon</label>
                            <div className="flex gap-2">
                                {['x', 'y'].map((axis) => (
                                    <div key={axis} className="w-1/2">
                                        <label>{axis.toUpperCase()}: {decalSettings.position[axis].toFixed(2)}</label>
                                        <input
                                            type="range"
                                            min="-10"
                                            max="10"
                                            step="0.1"
                                            value={decalSettings.position[axis]}
                                            onChange={(e) => {
                                                setDecalSettings((prev) => ({
                                                    ...prev,
                                                    position: { ...prev.position, [axis]: parseFloat(e.target.value) },
                                                }));
                                                if (selectedDecalRef.current) {
                                                    handleUpdateDecal();
                                                }
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Açı Ayarları */}
                        <div>
                            <label>Açı (Orientation)</label>
                            <div className="flex gap-2">
                                {['x', 'y', 'z'].map((axis) => (
                                    <div key={axis} className="w-1/3">
                                        <label>{axis.toUpperCase()}: {decalSettings.orientation[axis].toFixed(2)}</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="6.28" // Radyan: 0-2π
                                            step="0.01"
                                            value={decalSettings.orientation[axis]}
                                            onChange={(e) => {
                                                setDecalSettings((prev) => ({
                                                    ...prev,
                                                    orientation: { ...prev.orientation, [axis]: parseFloat(e.target.value) },
                                                }));
                                                if (selectedDecalRef.current) {
                                                    handleUpdateDecal();
                                                }
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className='bg-red-600 hover:bg-red-500 mt-5 px-4 py-2 rounded' onClick={() => decalRemove()}>Seçili Decali Kaldır</button>
                </div>
            )}
        </div>
    );
};

export default DecalControl;
