'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { handleMouseDown, handleMouseMove, handleMouseUp } from '@/components/Managers/MouseManager';
import ContorlPanel from '../components/Controls/ControlPanel'
import { useToast } from '@/components/Toast/ToastProvider';


const ThreeProject = () => {
  const containerRef = useRef();
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const modelsRef = useRef(new THREE.Group());
  const objectRef = useRef(null);
  const controlsRef = useRef(null);
  const dragControlsRef = useRef(null);
  const ambientLightRef = useRef(null);
  const directionalLightRef = useRef(null);
  const pointLightRef = useRef(null);
  const spotLightRef = useRef(null);
  const dragging = useRef(false);
  const selectedFace = useRef(null);
  const decalsRef = useRef([])
  const textRef = useRef([])
  const isModelSelected = useRef(false)
  const isModelRemoved = useRef(false)
  const uploadedTextureRef = useRef(null)
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const selectedModelRef = useRef(null);
  const selectedDecalRef = useRef(null)
  const selectedTextRef = useRef(null);
  const fileAppliedRef = useRef(null)
  const draggableObjects = [];
  const [isContainerReady, setIsContainerReady] = useState(false);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    if (containerRef.current) {
      setIsContainerReady(true);
    }
  }, [containerRef.current]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#fff');
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        10000
      );
      camera.position.set(0, 2, 10);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      ambientLightRef.current = ambientLight;

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(directionalLight);
      directionalLightRef.current = directionalLight;

      const pointLight = new THREE.PointLight(0xffffff, 3, 100);
      scene.add(pointLight);
      pointLightRef.current = pointLight;

      const spotLight = new THREE.SpotLight(0xffffff, 0.5);
      scene.add(spotLight);
      spotLightRef.current = spotLight;



      loadModel();
      sceneRef.current.add(modelsRef.current); // Grubu sahneye ekle
      const animate = () => {
        if (!renderer || !scene || !camera) return;
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

    }
    const onMouseDown = (event) => {
      handleMouseDown(event, mouse, raycaster, selectedModelRef, containerRef, selectedDecalRef, setIsDragEnabled, modelsRef, uploadedTextureRef, sceneRef, selectedFace, controlsRef, decalsRef, cameraRef, modelRef, fileAppliedRef, textRef, selectedTextRef, isModelSelected, isModelRemoved)
    }

    const onMouseMove = (event) => {
      handleMouseMove(event, mouse, raycaster, selectedFace, containerRef, dragging, cameraRef, modelRef)
    }

    const onMouseUp = () => {
      handleMouseUp(dragging, selectedFace, controlsRef)
    }
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current || !containerRef.current) return;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    if (containerRef.current) {
      window.addEventListener('resize', handleResize);
      containerRef.current.addEventListener('mousedown', onMouseDown);
      containerRef.current.addEventListener('mousemove', onMouseMove);
      containerRef.current.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      if (containerRef.current) {
        window.removeEventListener("resize", handleResize);
        containerRef.current.removeEventListener("mousedown", onMouseDown);
        containerRef.current.removeEventListener("mousemove", onMouseMove);
        containerRef.current.removeEventListener("mouseup", onMouseUp);
      }
    };
  }, [containerRef.current]);

  const loadModel = () => {
    if (!sceneRef.current) return;

    const materials = [
      new THREE.MeshStandardMaterial({ color: 'white' }),
      new THREE.MeshStandardMaterial({ color: 'white' }),
      new THREE.MeshStandardMaterial({ color: 'white' }),
      new THREE.MeshStandardMaterial({ color: 'white' }),
      new THREE.MeshStandardMaterial({ color: 'white' }),
      new THREE.MeshStandardMaterial({ color: 'white' }),
    ];


    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, materials);
    cube.name = 'küp'
    cube.position.set(0, 0, 0);
    sceneRef.current.add(cube);

    modelRef.current = cube;
    modelsRef.current.add(cube);
  };



  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
      console.error('Scene, camera, or renderer is not initialized yet.');
      return;
    }

    // Draggable Nesneleri Tanımlayın

    if (modelRef.current) draggableObjects.push(modelRef.current);
    if (objectRef.current) draggableObjects.push(modelsRef.current)
    // DragControls Nesnesini Başlatın
    dragControlsRef.current = new DragControls(draggableObjects, cameraRef.current, rendererRef.current.domElement);

    // DragControls Olayları
    dragControlsRef.current.addEventListener('dragstart', () => {
      controlsRef.current.enabled = false;
    });

    dragControlsRef.current.addEventListener('dragend', () => {
      controlsRef.current.enabled = true;
    });

    dragControlsRef.current.enabled = isDragEnabled;

    console.log('DragControls initialized:', dragControlsRef.current);
    return () => {
      dragControlsRef.current.dispose();
    };
  }, [isDragEnabled]);

  const toggleDragControls = () => {
    setIsDragEnabled((prev) => !prev);
  }
  useEffect(() => {
    const handleSelectedModelChange = () => {
      setSelectedModel(window.UVMapping.selectedModel || null);
    };

    window.addEventListener('selectedModelChange', handleSelectedModelChange);

    return () => {
      window.removeEventListener('selectedModelChange', handleSelectedModelChange);
    };
  }, []);
  return (
    <div className="flex h-screen">
      {/* Kontrol Paneli */}
      <div className="w-1/3 min-h-screen bg-gray-800 text-white p-4">
        <ContorlPanel
          containerRef={containerRef}
          sceneRef={sceneRef}
          rendererRef={rendererRef}
          uploadedTextureRef={uploadedTextureRef}
          cameraRef={cameraRef}
          handleMouseUp={handleMouseUp}
          handleMouseMove={handleMouseMove}
          handleMouseDown={handleMouseDown}
          controlsRef={controlsRef}
          dragControlsRef={dragControlsRef}
          selectedModelRef={selectedModelRef}
          ambientLightRef={ambientLightRef}
          spotLightRef={spotLightRef}
          pointLightRef={pointLightRef}
          directionalLightRef={directionalLightRef}
          objectRef={objectRef}
          modelRef={modelRef}
          modelsRef={modelsRef}
          selectedDecalRef={selectedDecalRef}
          fileAppliedRef={fileAppliedRef}
          textRef={textRef}
          selectedTextRef={selectedTextRef}
          decalsRef={decalsRef}
          draggableobjects={draggableObjects}
        />
      </div>
      {/* Sahne Alanı */}
      <div ref={containerRef} className="relative w-2/3 h-full border border-gray-700">
        <button
          onClick={toggleDragControls}
          className="absolute top-4 right-4 select-none bg-[#2a2d3e] text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          {isDragEnabled ? 'Sürüklemeyi Kapat' : 'Sürüklemeyi Aç'}
        </button>
      </div>
    </div>
  );

};


export default ThreeProject


