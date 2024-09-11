import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import bricksColor from '@/assets/wonderfulHouse/bricks/color.jpg';
import bricksAmbientOcclusion from '@/assets/wonderfulHouse/bricks/ambientOcclusion.jpg';
import bricksNormal from '@/assets/wonderfulHouse/bricks/normal.jpg';
import bricksRoughness from '@/assets/wonderfulHouse/bricks/roughness.jpg';
import doorColor from '@/assets/wonderfulHouse/door/color.jpg';
import doorAmbientOcclusion from '@/assets/wonderfulHouse/door/ambientOcclusion.jpg';
import doorNormal from '@/assets/wonderfulHouse/door/normal.jpg';
import doorDisplacement from '@/assets/wonderfulHouse/door/height.jpg';
import doorMetalness from '@/assets/wonderfulHouse/door/metalness.jpg';
import doorRoughness from '@/assets/wonderfulHouse/door/roughness.jpg';
import doorAlpha from '@/assets/wonderfulHouse/door/alpha.jpg';
import grassColor from '@/assets/wonderfulHouse/grass/color.jpg';
import grassAmbientOcclusion from '@/assets/wonderfulHouse/grass/ambientOcclusion.jpg';
import grassNormal from '@/assets/wonderfulHouse/grass/normal.jpg';
import grassRoughness from '@/assets/wonderfulHouse/grass/roughness.jpg';

const WonderfulHouse = () => {
    //
    const canvasRef = useRef<HTMLDivElement>(null);

    //加载砖块贴图
    const bricksColorTexture = new THREE.TextureLoader().load(bricksColor);
    const bricksAmbientOcclusionTexture = new THREE.TextureLoader().load(bricksAmbientOcclusion);
    const bricksNormalTexture = new THREE.TextureLoader().load(bricksNormal);
    const bricksRoughnessTexture = new THREE.TextureLoader().load(bricksRoughness);
    //门贴图
    const doorColorTexture = new THREE.TextureLoader().load(doorColor);
    const doorAmbientOcclusionTexture = new THREE.TextureLoader().load(doorAmbientOcclusion);
    const doorNormalTexture = new THREE.TextureLoader().load(doorNormal);
    const doorDisplacementTexture = new THREE.TextureLoader().load(doorDisplacement);
    const doorMetalnessTexture = new THREE.TextureLoader().load(doorMetalness);
    const doorRoughnessTexture = new THREE.TextureLoader().load(doorRoughness);
    const doorAlphaTexture = new THREE.TextureLoader().load(doorAlpha);
    //草地贴图
    const grassColorTexture = new THREE.TextureLoader().load(grassColor);
    const grassAmbientOcclusionTexture = new THREE.TextureLoader().load(grassAmbientOcclusion);
    const grassNormalTexture = new THREE.TextureLoader().load(grassNormal);
    const grassRoughnessTexture = new THREE.TextureLoader().load(grassRoughness);

    grassColorTexture.repeat.set(8, 8);
    grassAmbientOcclusionTexture.repeat.set(8, 8);
    grassNormalTexture.repeat.set(8, 8);
    grassRoughnessTexture.repeat.set(8, 8);

    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    grassNormalTexture.wrapS = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

    grassColorTexture.wrapT = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
    grassNormalTexture.wrapT = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

    //创建屋子
    const createHouse = (screen: THREE.Scene) => {
        const house = new THREE.Group();
        screen.add(house);

        //墙
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(4, 2.5, 4),
            new THREE.MeshStandardMaterial({
                color: "#ac8e82",
                map: bricksColorTexture,
                aoMap: bricksAmbientOcclusionTexture,
                normalMap: bricksNormalTexture,
                roughnessMap: bricksRoughnessTexture
            })
        );
        wall.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array, 2));
        wall.position.y = wall.geometry.parameters.height / 2;
        wall.castShadow = true;
        house.add(wall);

        //屋顶
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(4, 1.5, 4),
            new THREE.MeshStandardMaterial({
                color: "#b35f45",
            })
        );
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        roof.position.y = wall.geometry.parameters.height + roof.geometry.parameters.height / 2;
        house.add(roof);

        //门
        const door = new THREE.Mesh(
            new THREE.PlaneGeometry(2.25, 2.25),
            new THREE.MeshStandardMaterial({
                map: doorColorTexture,
                aoMap: doorAmbientOcclusionTexture,
                aoMapIntensity: 1,
                normalMap: doorNormalTexture,
                displacementMap: doorDisplacementTexture,
                displacementScale: 0.01,
                metalnessMap: doorMetalnessTexture,
                roughnessMap: doorRoughnessTexture,
                transparent: true,
                alphaMap: doorAlphaTexture
            })
        );
        door.castShadow = true;
        door.position.y = 1;
        door.position.z = wall.geometry.parameters.depth / 2 + 0.001;
        door.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
        house.add(door);

        //灌木
        const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
        const bushMaterial = new THREE.MeshStandardMaterial({
            color: "#89c854",
            map: grassColorTexture,
            aoMap: grassAmbientOcclusionTexture,
            normalMap: grassNormalTexture,
            roughnessMap: grassRoughnessTexture
        });
        const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
        bush1.scale.set(0.5, 0.5, 0.5);
        bush1.position.set(0.8, 0.2, 2.2);
        bush1.castShadow = true;

        const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
        bush2.scale.set(0.25, 0.25, 0.25);
        bush2.position.set(1.4, 0.1, 2.1);
        bush2.castShadow = true;

        const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
        bush3.scale.set(0.4, 0.4, 0.4);
        bush3.position.set(-0.8, 0.1, 2.2);
        bush3.castShadow = true;

        const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
        bush4.scale.set(0.15, 0.15, 0.15);
        bush4.position.set(-1, 0.05, 2.6);
        bush4.castShadow = true;

        house.add(bush1, bush2, bush3, bush4);

        // 门口的光源
        const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
        doorLight.position.set(0, 2.2, 2.7);
        doorLight.castShadow = true;
        house.add(doorLight);

        // 优化阴影性能
        doorLight.shadow.mapSize.width = 256;
        doorLight.shadow.mapSize.height = 256;
        doorLight.shadow.camera.far = 7;
    };

    //地面
    const createGround = (screen: THREE.Scene) => {
        const floor = new THREE.Group();
        screen.add(floor);

        //草地
        const grass = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshStandardMaterial({
                map: grassColorTexture,
                aoMap: grassAmbientOcclusionTexture,
                normalMap: grassNormalTexture,
                roughnessMap: grassRoughnessTexture
            })
        );
        grass.rotation.x = -Math.PI * 0.5;
        // grass.castShadow = true;
        grass.receiveShadow = true;
        grass.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(grass.geometry.attributes.uv.array, 2));
        floor.add(grass);

        //碑石
        const stoneGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.4);
        const stoneMaterial = new THREE.MeshStandardMaterial({
            color: "#b2b6b1"
        });
        for (let i = 0; i < 80; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 4 + Math.random() * 4.5;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
            stone.position.set(x, stoneGeometry.parameters.height / 2 - 0.1, z);
            stone.rotation.y = Math.random() * (Math.PI / 8);
            stone.rotation.z = Math.random() * (Math.PI / 10);
            stone.castShadow = true;
            floor.add(stone);
        };
    };


    useEffect(() => {
        // 创建场景
        const scene = new THREE.Scene();
        // 创建相机
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor("#262837");
        canvasRef.current!.appendChild(renderer.domElement);

        // 创建屋子
        createHouse(scene);
        //创建地面
        createGround(scene);

        //雾
        scene.fog = new THREE.Fog("#262837", 1, 15);

        //幽灵
        const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
        scene.add(ghost1);
        const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
        scene.add(ghost2);
        const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
        scene.add(ghost3);
        ghost1.castShadow = true;
        ghost2.castShadow = true;
        ghost3.castShadow = true;

        // 创建灯光
        const light = new THREE.AmbientLight("#b9d5ff", 0.12);
        light.castShadow = true;
        scene.add(light);

        //定向灯
        const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
        moonLight.position.set(4, 5, -2);
        moonLight.castShadow = true;
        scene.add(moonLight);

        //相机位置
        camera.position.set(0, 2, 10);
        camera.lookAt(0, 0, 0);

        // 渲染场景
        renderer.render(scene, camera);
        canvasRef.current?.appendChild(renderer.domElement);

        // 优化阴影性能
        ghost1.shadow.mapSize.width = 256;
        ghost1.shadow.mapSize.height = 256;
        ghost1.shadow.camera.far = 7;

        ghost2.shadow.mapSize.width = 256;
        ghost2.shadow.mapSize.height = 256;
        ghost2.shadow.camera.far = 7;

        ghost3.shadow.mapSize.width = 256;
        ghost3.shadow.mapSize.height = 256;
        ghost3.shadow.camera.far = 7;

        //控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI / 2 - 0.1;

        // 添加渲染循环
        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            const ghost1Angle = elapsedTime * 0.5;
            ghost1.position.x = Math.sin(ghost1Angle) * 4;
            ghost1.position.z = Math.cos(ghost1Angle) * 4;
            ghost1.position.y = Math.sin(elapsedTime * 3);

            const ghost2Angle = -elapsedTime * 0.32;
            ghost2.position.x = Math.sin(ghost2Angle) * 5;
            ghost2.position.z = Math.cos(ghost2Angle) * 5;
            ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

            const ghost3Angle = -elapsedTime * 0.18;
            ghost3.position.x = Math.sin(ghost3Angle) * 4 + (Math.sin(elapsedTime * 0.32) + 3);
            ghost3.position.z = Math.cos(ghost3Angle) * 4 + (Math.sin(elapsedTime * 0.32) + 3);
            ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2.5);

            // 更新控制器
            controls.update();

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            controls.dispose();
            renderer.dispose();
            canvasRef.current?.removeChild(renderer.domElement);
        }

    }, []);
    return <div ref={canvasRef} />
};

export default WonderfulHouse;
