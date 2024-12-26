import * as THREE from 'three'

export const createCanvas = (sceneRef, width, height) => {
    if (!sceneRef.current) {
        console.error("Sahne mevcut değil.");
        return null;
    }

    // Yeni bir canvas oluştur
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // Canvas'tan bir texture oluştur
    const texture = new THREE.CanvasTexture(canvas);

    // Canvas materyalini oluştur ve sahneye ekle
    const material = new THREE.MeshBasicMaterial({
        map: texture, transparent: true, // Saydamlık ekleyin
        opacity: 1.0
    });
    const geometry = new THREE.PlaneGeometry(width / 100, height / 100); // Canvas boyutlarını ölçeklendirin
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0); // Ortada başlasın

    // Three.js sahnesine ekle
    sceneRef.current.add(mesh);

    // Geri döndür
    return {
        canvas,
        ctx: canvas.getContext('2d'),
        texture
    };
};

export const addShape = (ctx, id, shape, properties) => {
    const { x, y, width, height, radius, color } = properties;
    ctx.fillStyle = color;

    if (shape === 'rectangle') {
        ctx.fillRect(x, y, width, height);
    } else if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Texture güncellemesi gerekiyorsa
    if (ctx.canvas.texture) {
        ctx.canvas.texture.needsUpdate = true;
    }

    console.log(`Shape ID: ${id} - Güncellendi.`);
};

export const addText = (ctx, id, text, properties) => {
    const { x, y, fontSize, fontFamily, color } = properties;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(text, x, y);


    if (ctx.canvas.texture) {
        ctx.canvas.texture.needsUpdate = true;
    }

    console.log(`Text ID: ${id} - Eklendi.`);
};

const imageCache = {};

export const addImage = (ctx, id, image, properties, isImageAdded) => {
    const { x, y, width, height } = properties;


    if (imageCache[image]) {
        ctx.drawImage(imageCache[image], x, y, width, height);
        if (ctx.canvas.texture) {
            ctx.canvas.texture.needsUpdate = true;
        }
        return;
    }


    const img = new Image();
    img.src = image;
    img.onload = () => {
        imageCache[image] = img;
        ctx.drawImage(img, x, y, width, height);
        if (ctx.canvas.texture) {
            ctx.canvas.texture.needsUpdate = true;
        }
    };
    img.onerror = () => {
        console.error('Resim yüklenemedi!');
    };
};