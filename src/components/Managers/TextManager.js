import * as THREE from 'three';

export const addTextToFace = (
    text,
    fontSize,
    color,
    selectedModelRef,
    face,
    sceneRef,
    textRef
) => {
    if (!selectedModelRef.current || !sceneRef.current) {
        console.error("Model veya sahne mevcut değil.");
        return;
    }

    // Canvas oluştur
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const canvasSize = 512; // 512x512 boyutunda canvas
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arka plan (isteğe bağlı olarak beyaz yapabilirsiniz)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Yazı stilini ayarla (fontSize doğrudan kullanılacak)
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";


    ctx.fillText(text, canvas.width / 2, canvas.height / 2);


    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    console.log(selectedModelRef.current.name)


    if (selectedModelRef.current.name === "küp") {
        const faceIndices = {
            front: 4,
            back: 5,
            top: 2,
            bottom: 3,
            right: 0,
            left: 1,
        };

        const materials = selectedModelRef.current.material;
        if (Array.isArray(materials)) {
            const faceIndex = faceIndices[face];
            if (faceIndex === undefined) {
                console.error("Geçersiz yüzey seçildi:", face);
                return;
            }
            if (materials[faceIndex]) {
                materials[faceIndex].map = texture;
                materials[faceIndex].needsUpdate = true;
                console.log(`Metin ${face} yüzeyine eklendi (küp modeli).`);
            } else {
                console.error(`Yüzey ${face} için malzeme bulunamadı.`);
            }
        } else {
            console.error("Küp modeli beklenilen malzeme formatında değil.");
        }
    } else {
        console.warn("Bu model için metin ekleme desteklenmiyor.");
    }

    // Metin referansına kaydet
    textRef.current = {
        text,
        fontSize,
        color,
        face,
        texture,
    };

    console.log(`Metin ${face} yüzeyine başarıyla eklendi.`);
};

export const removeTextFromFace = (selectedModelRef, face, textRef) => {
    if (!selectedModelRef.current) {
        console.log("Model mevcut değil.");
        return;
    }

    if (selectedModelRef.current.name === "küp") {
        const faceIndices = {
            front: 4,
            back: 5,
            top: 2,
            bottom: 3,
            right: 0,
            left: 1,
        };

        const materials = selectedModelRef.current.material;

        if (Array.isArray(materials)) {
            const faceIndex = faceIndices[face];
            if (faceIndex === undefined) {
                console.error("Geçersiz yüzey seçildi:", face);
                return;
            }

            if (materials[faceIndex]) {
                materials[faceIndex].map = null; // Map'i temizle
                materials[faceIndex].needsUpdate = true; // Güncellemeyi zorunlu kıl
                console.log(`Metin ${face} yüzeyinden kaldırıldı (küp modeli).`);
            } else {
                console.error(`Yüzey ${face} için malzeme bulunamadı.`);
            }
        } else {
            console.error("Küp modeli beklenilen malzeme formatında değil.");
        }
    } else {
        console.warn("Bu model için metin kaldırma desteklenmiyor.");
    }


};

