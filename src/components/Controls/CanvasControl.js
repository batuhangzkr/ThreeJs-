import React, { useState, useEffect, useRef } from 'react';
import { addShape, addText, createCanvas, addImage } from '../Managers/CanvasManager';

const CanvasControl = ({ sceneRef, accordion, toggleAccordion }) => {
    const [canvasData, setCanvasData] = useState(null);
    const [elements, setElements] = useState([]);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [currentType, setCurrentType] = useState('text');
    const [canvasCreated, setCanvasCreated] = useState(false);
    const isImageAdded = useRef(null);

    const [textProps, setTextProps] = useState({
        text: 'Hello World!',
        x: 2200,
        y: 2500,
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#000000'
    });


    const [shapeProps, setShapeProps] = useState({
        shape: 'rectangle',
        x: 2800,
        y: 2500,
        width: 100,
        height: 100,
        color: '#ff0000'
    });
    const [imageProps, setImageProps] = useState({
        src: null,
        shape: 'image',
        x: 2500,
        y: 2800,
        width: 400,
        height: 400,
    });




    const handleCreateCanvas = () => {
        if (!canvasData) {
            const newCanvasData = createCanvas(sceneRef, 5000, 5000);
            setCanvasData(newCanvasData);
            setCanvasCreated(true)
        }
    };



    const handleAddElement = () => {
        if (!canvasData || !canvasData.ctx) return;

        const newElement = {
            id: elements.length + 1,
            type: currentType,
            props: currentType === 'text' ? { ...textProps } :
                currentType === 'shape' ? { ...shapeProps } :
                    { ...imageProps }
        };

        setElements([...elements, newElement]);
        setSelectedElementId(newElement.id);
    };



    const handleSelectElement = (id) => {
        const selectedElement = elements.find((el) => el.id === id);
        if (selectedElement) {
            setSelectedElementId(id);
            setCurrentType(selectedElement.type);
            if (selectedElement.type === 'text') {
                setTextProps({ ...selectedElement.props });
            } else if (selectedElement.type === 'shape') {
                setShapeProps({ ...selectedElement.props });
            } else if (selectedElement.type === 'image') {
                setShapeProps({ ...selectedElement.props });
            }
        }
    };

    const handleUpdateElement = () => {
        if (!canvasData || !canvasData.ctx || selectedElementId === null) return;

        const updatedElements = elements.map((el) => {
            if (el.id === selectedElementId) {
                if (el.type === 'text') {
                    return { ...el, props: { ...textProps } };
                } else if (el.type === 'shape') {
                    return { ...el, props: { ...shapeProps } };
                } else if (el.type === 'image') {
                    return { ...el, props: { ...imageProps } };
                }
            }
            return el;
        });

        setElements(updatedElements);
    };

    useEffect(() => {

        const canvases = document.querySelectorAll('canvas');
        canvases.forEach((canvas, index) => {
            if (index > 0) canvas.remove();
        });
    }, []);

    useEffect(() => {
        if (!canvasData || !canvasData.ctx) return;

        const ctx = canvasData.ctx;
        ctx.clearRect(0, 0, canvasData.canvas.width, canvasData.canvas.height);

        elements.forEach((el) => {
            if (el.type === 'text') {
                addText(ctx, el.id, el.props.text, el.props);
            } else if (el.type === 'shape') {
                addShape(ctx, el.id, el.props.shape, el.props);
            } else if (el.type === 'image') {
                addImage(ctx, el.id, el.props.src, el.props, isImageAdded);
            }
        });

        if (canvasData.texture) {
            canvasData.texture.needsUpdate = true;
        }
    }, [elements, canvasData]);

    useEffect(() => {
        if (selectedElementId) {
            handleUpdateElement();
        }
    }, [selectedElementId, textProps, shapeProps, imageProps]);


    return (
        <div className="bg-[#2a2d3e] p-4 rounded border-l border-b select-none border-gray-500">
            <h3
                onClick={() => toggleAccordion('canvas')}
                className="cursor-pointer p-1 flex justify-between items-center"
            >
                Canvas Kontrol <span>{accordion.canvas ? '−' : '+'}</span>
            </h3>
            {accordion.canvas && (
                canvasCreated ? (
                    <div>
                        <select
                            value={currentType}
                            onChange={(e) => setCurrentType(e.target.value)}
                            className="w-full bg-gray-700 mt-4 text-white px-4 py-2 rounded mb-4"
                        >
                            <option value="text">Metin</option>
                            <option value="shape">Şekil</option>
                            <option value="image">Resim</option>
                        </select>


                        <button
                            onClick={handleAddElement}
                            className={`${currentType === 'image' && !imageProps.src
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500'
                                } text-white py-2 px-4 rounded mb-4`}
                            disabled={currentType === 'image' && !imageProps.src}
                        >
                            {currentType === 'text'
                                ? 'Metin Ekle'
                                : currentType === 'shape'
                                    ? 'Şekil Ekle'
                                    : 'Resim Ekle'}
                        </button>


                        <div className="mb-4">
                            <label className="block mb-2">Eklenen Öğeler:</label>
                            <select
                                value={selectedElementId || ''}
                                onChange={(e) => handleSelectElement(parseInt(e.target.value))}
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                <option value="">Öğe Seç</option>
                                {elements.map((el) => (
                                    <option key={el.id} value={el.id}>
                                        ID: {el.id}, Tür: {el.type}
                                    </option>
                                ))}
                            </select>
                        </div>



                        {currentType === 'text' && (
                            <div>
                                <label className="block mb-2">Metin:</label>
                                <input
                                    type="text"
                                    value={textProps.text}
                                    onChange={(e) => setTextProps({ ...textProps, text: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-4"
                                />

                                <label className="block mb-2">Renk:</label>
                                <input
                                    type="color"
                                    value={textProps.color}
                                    onChange={(e) => setTextProps({ ...textProps, color: e.target.value })}
                                    className="w-full mb-4"
                                />

                                <label className="block mb-2">Pozisyon:</label>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-300">X Pozisyonu: {textProps.x}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="10"
                                        value={textProps.x}
                                        onChange={(e) => setTextProps({ ...textProps, x: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <label className="text-sm text-gray-300">Y Pozisyonu: {textProps.y}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="10"
                                        value={textProps.y}
                                        onChange={(e) => setTextProps({ ...textProps, y: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                <label className="block mb-2">Yazı Boyutu:</label>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-300">Font Boyutu: {textProps.fontSize}px</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="400"
                                        step="1"
                                        value={textProps.fontSize}
                                        onChange={(e) => setTextProps({ ...textProps, fontSize: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}


                        {currentType === 'image' && (
                            <div>
                                <label className="block mb-2">Resim Yükle:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setImageProps({ ...imageProps, src: event.target.result });
                                            };
                                            reader.readAsDataURL(file); // Resmi Base64 formatında okur
                                        }
                                    }}
                                    className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-4"
                                />

                                <label className="block mb-2">Pozisyon:</label>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-300">X Pozisyonu: {imageProps.x}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="10"
                                        value={imageProps.x}
                                        onChange={(e) => setImageProps({ ...imageProps, x: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <label className="text-sm text-gray-300">Y Pozisyonu: {imageProps.y}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="10"
                                        value={imageProps.y}
                                        onChange={(e) => setImageProps({ ...imageProps, y: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                <label className="block mb-2">Boyut:</label>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-300">Genişlik: {imageProps.width}px</label>
                                    <input
                                        type="range"
                                        min="200"
                                        max="5000"
                                        step="10"
                                        value={imageProps.width}
                                        onChange={(e) => setImageProps({ ...imageProps, width: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <label className="text-sm text-gray-300">Yükseklik: {imageProps.height}px</label>
                                    <input
                                        type="range"
                                        min="200"
                                        max="5000"
                                        step="10"
                                        value={imageProps.height}
                                        onChange={(e) => setImageProps({ ...imageProps, height: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}


                        {currentType === 'shape' && (
                            <div>
                                <label className="block mb-2">Şekil Türü:</label>
                                <select
                                    value={shapeProps.shape}
                                    onChange={(e) => setShapeProps({ ...shapeProps, shape: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-4"
                                >
                                    <option value="rectangle">Dikdörtgen</option>
                                    <option value="circle">Daire</option>
                                </select>

                                <label className="block mb-2">Renk:</label>
                                <input
                                    type="color"
                                    value={shapeProps.color}
                                    onChange={(e) => setShapeProps({ ...shapeProps, color: e.target.value })}
                                    className="w-full mb-4"
                                />

                                <label className="block mb-2">Pozisyon:</label>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-300">X Pozisyonu: {shapeProps.x}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="10"
                                        value={shapeProps.x}
                                        onChange={(e) => setShapeProps({ ...shapeProps, x: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <label className="text-sm text-gray-300">Y Pozisyonu: {shapeProps.y}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="10"
                                        value={shapeProps.y}
                                        onChange={(e) => setShapeProps({ ...shapeProps, y: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                <label className="block mb-2">Boyut:</label>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-300">Genişlik: {shapeProps.width}</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="5000"
                                        step="10"
                                        value={shapeProps.width}
                                        onChange={(e) => setShapeProps({ ...shapeProps, width: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <label className="text-sm text-gray-300">Yükseklik: {shapeProps.height}</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="5000"
                                        step="10"
                                        value={shapeProps.height}
                                        onChange={(e) => setShapeProps({ ...shapeProps, height: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => { handleCreateCanvas(); setCanvasCreated(true) }}
                        className="bg-green-600 text-white py-2 px-4 rounded mt-4 text-center"
                    >
                        ✅ Canvası Oluştur!
                    </button>
                )
            )}

        </div>
    );

};
export default CanvasControl