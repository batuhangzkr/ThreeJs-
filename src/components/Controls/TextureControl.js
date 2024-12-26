import React, { useState, useRef } from 'react'
import { addImageToFace } from '../Managers/ModelManager';



const TextureControl = ({ accordion, toggleAccordion, modelRef }) => {
    const [images, setImages] = useState([]);
    const [selectedFace, setSelectedFace] = useState('front');
    const inputRef = useRef(null);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);

    const applyImageToFace = (index) => {
        if (!images[index]) return;
        addImageToFace(images[index], selectedFace, width, height, modelRef);
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    newImages.push(img);
                    if (newImages.length === files.length) {
                        setImages((prev) => [...prev, ...newImages]);
                    }
                };
            };
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="bg-[#2a2d3e] p-4 rounded border-l border-b select-none border-gray-500">
            <h3 onClick={() => toggleAccordion('images')} className="cursor-pointer p-1 flex justify-between items-center">
                Resim Yükleme <span className='italic'>(küp için)</span> <span>{accordion.images ? '−' : '+'}</span>
            </h3>
            {accordion.images && (
                <>
                    {/* Yüz Seçimi */}
                    <div className="mb-4">
                        <label htmlFor="faceSelection" className="block mb-2">Yüz Seçimi:</label>
                        <select
                            id="faceSelection"
                            value={selectedFace}
                            onChange={(e) => setSelectedFace(e.target.value)}
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

                    {/* Resim Yükleme */}
                    <div className="w-full my-2">
                        <label
                            htmlFor="fileUpload"
                            className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition duration-300"
                        >
                            Resim Yükle
                        </label>
                        <input
                            id="fileUpload"
                            ref={inputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                    <div className="space-y-2">
                        <label>Genişlik: {width.toFixed(2)}</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={width}
                            onChange={(e) => setWidth(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <label>Yükseklik: {height.toFixed(2)}</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={height}
                            onChange={(e) => setHeight(parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => applyImageToFace(index)}
                                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
                            >
                                Resim {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default TextureControl