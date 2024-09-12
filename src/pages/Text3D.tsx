import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import helvetikerText from 'three/examples/fonts/helvetiker_regular.typeface.json'
import mapcapImg from '@/assets/3Dtext/8.png'

const Text3D = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //场景
    const scene = new THREE.Scene();

    //texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(mapcapImg);

    //文字 模型
    const fontLoader = new FontLoader();
    const font = fontLoader.parse(helvetikerText);
    const textGeometry = new TextGeometry('Hello World', {
      font: font,
      size: 3,
      height: 1,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: 0.5,
      bevelSize: 0.1,
      bevelSegments: 10
    });
    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: texture });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.center();
    scene.add(textMesh);

    for (let i = 0; i < 200; i++) {
      const tourgeomery = new THREE.TorusGeometry(1, 0.6, 16, 100);
      // const material = new THREE.MeshMatcapMaterial({ map: texture });
      const material = new THREE.MeshMatcapMaterial({ matcap: texture });
      const cube = new THREE.Mesh(tourgeomery, material);
      const random = Math.random() * 1.5;
      cube.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
      );
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      cube.scale.set(random, random, random);
      scene.add(cube);
    }

    //光源


    const width: number = canvasRef.current?.clientWidth || 0;
    const height: number = canvasRef.current?.clientHeight || 0;
    //相机
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 0, 40);
    camera.lookAt(0, 0, 0);

    //渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    canvasRef.current?.appendChild(renderer.domElement);
    renderer.render(scene, camera);

    //控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    const tick = () => {
      // 更新控制器
      controls.update();

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    //销毁
    return () => {
      controls.dispose();
      renderer.dispose();
      canvasRef.current?.removeChild(renderer.domElement);
    }

  }, [])

  return (
    <div className="w-full h-full" ref={canvasRef} />
  )
}

export default Text3D;