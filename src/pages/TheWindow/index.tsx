import { useEffect, useRef } from 'react';
import './index.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from "three/examples/jsm/libs/stats.module.js";

//引入外部个 gltf模型，并且初始化视角，加载模型动画，放大模型某个组件大小等;
//7. 递归遍历层级模型修改材质
function TheWindow() {
    const threeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        //场景
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: false });

        //光源
        const light = new THREE.AmbientLight(0xffffff, 5); // 将强度从10降低到1
        scene.add(light);

        //渲染器
        renderer.setClearColor(0xcccccc);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        threeRef.current?.appendChild(renderer.domElement);

        //控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener("change", () => {
            // console.log("listener", listener?.target, camera);
            // renderer.render(scene, camera);
        });

        //帧率
        const status = new Stats();
        status.dom.style.left = "unset";
        status.dom.style.right = "0";
        threeRef.current?.appendChild(status.dom);

        // Animation mixer
        let mixer: THREE.AnimationMixer;

        //渲染循环
        const clock = new THREE.Clock();
        const render = () => {
            status.update();
            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        };


        //加载模型
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            "/model/1930s/scene.gltf", (gltf) => {
                console.log("model", gltf);
                const model = gltf?.scene;
                model.scale.set(1, 1, 1);
                // model.animations
                scene.add(model);

                //getObjectByName获取指定组件；
                const node = model?.getObjectByName("group42");
                console.log("node", node);
                node?.scale.set(2, 2, 1);

                //递归 mesh组件；
                model?.traverse((obj) => {
                    console.log("递归 mesh组件", obj, obj?.name)
                })

                // 创建动画混合器并播放动画
                mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });

                // 计算模型的包围盒
                const box = new THREE.Box3().setFromObject(model);
                const boxCenter = box.getCenter(new THREE.Vector3());
                const boxSize = box.getSize(new THREE.Vector3());

                // 设置相机位置以显示模型正面
                const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
                const fov = camera.fov * (Math.PI / 180); // 将视角转换为弧度
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

                cameraZ *= 1.5; // 可选：增加一个因子以确保模型完全显示在视图中
                camera.position.set(boxCenter.x, boxCenter.y, cameraZ);

                camera.lookAt(boxCenter);
                // controls.target.set(boxCenter.x, boxCenter.y, boxCenter.z);
                camera.position.set(
                    0.316,
                    0.10108, 0.10815);
                controls.target.set(0.3275, 0.0809, -0.0314);

                render(); // 启动渲染循环
            });

        //销毁
        return () => {
            renderer.dispose();
            threeRef.current?.removeChild(renderer.domElement);
        }

    }, []);

    return (
        <div ref={threeRef} />
    )
}

export default TheWindow;
