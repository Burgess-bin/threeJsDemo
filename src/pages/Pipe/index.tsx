import { useEffect, useRef } from 'react'
import './index.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from "three/examples/jsm/libs/stats.module.js";

//模型边界线EdgesGeometry
function Pipe() {
    const threeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        //场景
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
        camera.position.set(200, 200, 30);
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            // 设置对数深度缓冲区，优化深度冲突问题
            logarithmicDepthBuffer: true
        });

        //管道
        const path = new THREE.CatmullRomCurve3([ //曲线
            new THREE.Vector3(-50, 20, 90),
            new THREE.Vector3(-10, 40, 40),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(60, -60, 0),
            new THREE.Vector3(90, -40, 60),
            new THREE.Vector3(120, 30, 30),
        ]);
        const geometry = new THREE.TubeGeometry(path, 300, 5, 30);
        const texLoader = new THREE.TextureLoader();
        const texture = texLoader.load('/guandao2.jpeg');
        // const texture = texLoader.load('/src/assets/guandao1.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = 10;
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        //光源
        const light = new THREE.AmbientLight(0xffffff, 10);
        scene.add(light);

        //渲染器
        renderer.setClearColor(0x404040);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        threeRef.current?.appendChild(renderer.domElement);

        //控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener("change", () => {
        });

        //帧率
        const status = new Stats();
        status.dom.style.left = "unset";
        status.dom.style.right = "0";
        threeRef.current?.appendChild(status.dom);

        //管道漫游;
        const pointsList = path.getSpacedPoints(500);
        let i = 0;
        const render = () => {
            if (i < pointsList.length - 1) {
                camera.position.copy(pointsList[i]);
                camera.lookAt(pointsList[i + 1]);
                i++;
            } else {
                i = 0;
            }
            status.update();
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        };
        render();



        //销毁
        return () => {
            renderer.dispose();
            threeRef.current?.removeChild(renderer.domElement);
            threeRef.current?.removeChild(status.dom);
        }

    }, [])

    return (
        <div ref={threeRef} />
    )
}

export default Pipe
