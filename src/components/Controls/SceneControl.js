import React, { useState } from 'react'
import { updateSceneColor } from '../Managers/SceneManager';

const SceneControl = ({ accordion, toggleAccordion, sceneRef }) => {
    const [sceneColor, setSceneColor] = useState('');

    const updateScenebgColor = (color) => {
        if (updateSceneColor) {
            updateSceneColor(color, sceneRef);
        }
    };

    return (
        <div className="bg-[#2a2d3e] p-4 rounded border-l border-b select-none border-gray-500">
            <h3 onClick={() => toggleAccordion('scene')} className="cursor-pointer p-1 flex justify-between items-center">
                Arka Plan Rengi <span>{accordion.scene ? '−' : '+'}</span>
            </h3>
            {accordion.scene && (
                <div className="space-y-2">
                    <label></label>
                    <input
                        type="color"
                        value={sceneColor}
                        onChange={(e) => updateScenebgColor(e.target.value)}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    )
}

export default SceneControl