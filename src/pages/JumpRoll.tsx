import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from 'lil-gui';
import SimpleShadow from "@/assets/jumpRoll/simpleShadow.jpg";
const JumpRoll = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 加载阴影贴图
        const textureLoader = new THREE.TextureLoader();
        const simpleShadow = textureLoader.load(SimpleShadow);

        // 初始化Three.js场景
        const width: number = canvasRef.current?.clientWidth || 0;
        const height: number = canvasRef.current?.clientHeight || 0;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.shadowMap.enabled = false;
        renderer.setSize(width, height);
        canvasRef.current?.appendChild(renderer.domElement);

        // 创建一个球体
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = false;
        scene.add(sphere);

        // 创建一个平面
        const planGeometry = new THREE.PlaneGeometry(8, 8);
        const planMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const plane = new THREE.Mesh(planGeometry, planMaterial);
        plane.rotation.x = -Math.PI * 0.5;
        plane.position.y = -0.5;
        plane.receiveShadow = true;
        scene.add(plane);

        // 添加一个用于调试的GUI
        const gui = new GUI({ container: canvasRef.current as HTMLElement, });

        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
        scene.add(ambientLight);

        // 平行光
        const light = new THREE.DirectionalLight(0xffffff, 3);
        const lightHelper = new THREE.DirectionalLightHelper(light);
        light.position.set(10, 10, 100);
        scene.add(light, lightHelper);

        // 聚光灯
        const spotLight = new THREE.SpotLight(0xffffff, 3, 10, Math.PI / 7, 0, 0);
        spotLight.position.set(0, 7, 2);
        spotLight.castShadow = false;
        spotLight.shadow.mapSize.set(1024 * 2, 1024 * 2);
        spotLight.shadow.camera.fov = 30;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 6;
        scene.add(spotLight);
        scene.add(spotLight.target);
        gui.add(spotLight.position, 'x', -10, 10);
        gui.add(spotLight.position, 'y', 0, 20);
        gui.add(spotLight.position, 'z', -10, 10);
        gui.add(spotLight, 'intensity', 0, 10);
        gui.add(spotLight, 'distance', 0, 200);
        gui.add(spotLight, 'angle', 0, Math.PI / 2);

        // 阴影
        const planeShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 1.5),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                alphaMap: simpleShadow
            })
        );
        planeShadow.rotation.x = -Math.PI * 0.5;
        planeShadow.position.y = plane.position.y + 0.01;
        scene.add(planeShadow);

        // 相机位置
        camera.position.set(1, 5, 5);
        camera.lookAt(scene.position);

        // 控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // 阻尼效果

        renderer.render(scene, camera);
        // 渲染循环
        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            sphere.position.x = Math.sin(elapsedTime) * 3;
            sphere.position.z = Math.cos(elapsedTime) * 3;
            sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

            planeShadow.position.x = sphere.position.x;
            planeShadow.position.z = sphere.position.z;
            planeShadow.material.opacity = (1 - sphere.position.y) * 0.4;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // 销毁Three.js资源
        return () => {
            gui.destroy();
            renderer.dispose();
            canvasRef.current?.removeChild(renderer.domElement);
        };
    }, []);
    return <div className="w-full h-full relative" ref={canvasRef} />
};

export default JumpRoll;
