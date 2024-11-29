import { useEffect, useRef } from 'react'
import './index.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

// 1、PBR材质金属度和粗糙度
// 2、环境贴图.envMap(金属效果)
function Mirror() {
    const threeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        //场景
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        //环境贴图
        const cubTexture = new THREE.CubeTextureLoader().setPath('/Bridge2/').load(
            ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']
        );
        cubTexture.colorSpace = THREE.SRGBColorSpace;
        scene.background = cubTexture;

        //模型
        const sphereGemotry = new THREE.SphereGeometry(1, 64, 64);
        const material = new THREE.MeshBasicMaterial({
            envMap: cubTexture,
            reflectivity: 1
        });
        const mesh = new THREE.Mesh(sphereGemotry, material);

        const boxGemotry = new THREE.BoxGeometry(1, 1, 1);
        // const materialBox = new THREE.MeshStandardMaterial({
        //     metalness: 1,
        //     roughness: 0, //粗糙度
        //     envMap: cubTexture
        // });
        const materialBox = new THREE.MeshPhysicalMaterial({
            metalness: 1,
            clearcoat: 1,
            ior: 1.5,//折射率
            clearcoatRoughness: 0.1,
            roughness: 0, //粗糙度
            // color: 0xc0c0c0,
            envMap: cubTexture
        });
        const boxMesh = new THREE.Mesh(boxGemotry, materialBox);
        boxMesh.position.set(2, 0, 0);
        scene.add(mesh, boxMesh);

        //光源

        //相机
        camera.position.set(0, 0, 8);
        camera.lookAt(mesh.position);

        //渲染器
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xcccccc)
        renderer.render(scene, camera);
        threeRef.current?.appendChild(renderer.domElement);

        //控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', () => {
        });

        //帧率
        const stats = new Stats();
        stats.dom.style.left = "unset";
        stats.dom.style.right = "0";
        threeRef.current?.appendChild(stats.dom);

        const render = () => {
            stats.update();
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        };
        render();

        //下载 canvas 内容；
        // 创建一个超链接元素，用来下载保存数据的文件
        // setTimeout(() => {
        //     const link = document.createElement('a');
        //     // 通过超链接herf属性，设置要保存到文件中的数据
        //     link.href = renderer.domElement.toDataURL("image/png");
        //     link.download = 'threejs.png'; //下载文件名
        //     link.click(); //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
        // }, 5000);

        //销毁
        return () => {
            renderer.dispose();
            threeRef.current?.removeChild(renderer.domElement);
            threeRef.current?.removeChild(stats.dom);
        }

    }, [])

    return (
        <div ref={threeRef} />
    )
}

export default Mirror
