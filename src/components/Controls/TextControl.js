import React, { useEffect, useState } from 'react';
import { addTextToFace, removeTextFromFace } from '../Managers/TextManager';

const TextControl = ({
    accordion,
    toggleAccordion,
    selectedModelRef,
    sceneRef,
    textRef,
    selectedTextRef,
    modelRef
}) => {
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(10);
    const [color, setColor] = useState('#000000');
    const [face, setFace] = useState("front");

    const handleAddText = () => {
        if (!selectedModelRef.current && !sceneRef.current) return;
        addTextToFace(
            text,
            fontSize,
            color,
            modelRef,
            face,
            sceneRef,
            textRef);
    };

    useEffect(() => {
        handleAddText();
    }, [fontSize, color, text])

    const handleRemoveText = () => {

        removeTextFromFace(selectedModelRef, face, textRef);

    };

    return (
        <div className="bg-[#2a2d3e] p-4 rounded border-l border-b select-none border-gray-500">
            <h3 onClick={() => toggleAccordion('texts')} className="cursor-pointer p-1 flex justify-between items-center">
                Metin Ekleme <span className='italic'>(küp için)</span> <span>{accordion.texts ? '−' : '+'}</span>
            </h3>
            {accordion.texts && (
                <>
                    <div className="mb-4">
                        <label htmlFor="faceSelection" className="block mb-2">
                            Yüzey Seçimi:
                        </label>
                        <select
                            id="faceSelection"
                            value={face}
                            onChange={(e) => setFace(e.target.value)}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded"
                        >
                            <option value="front">Front</option>
                            <option value="back">Back</option>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="right">Right</option>
                            <option value="left">Left</option>

                        </select>
                    </div>


                    <div className="mb-4">
                        <label className="block text-white mb-2">Metin:</label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white mb-2">
                            Font Boyutu: {fontSize}
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="400"
                            step="1"
                            value={fontSize}
                            onChange={(e) => {
                                setFontSize(e.target.value);
                                handleAddText(); // Her font boyutu değişiminde metni güncelle
                            }}
                            className="w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white mb-2">Renk:</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                                setColor(e.target.value);
                                handleAddText(); // Her renk değişiminde metni güncelle
                            }}
                            className="w-full"
                        />
                    </div>

                    {/* Metin Kontrol Butonu */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleRemoveText}
                            className="bg-red-600 hover:bg-red-500 text-white  rounded w-full"
                        >
                            Metni Kaldır
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TextControl;
