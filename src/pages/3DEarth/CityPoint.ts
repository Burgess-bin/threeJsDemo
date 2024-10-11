import * as THREE from 'three';
import { lon2xyz } from './common';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

interface Point {
    name: string;
    E: number;
    N: number;
}

export class CityPoint {
    private clock: THREE.Clock;
    private radius: number;
    private textures: THREE.Texture;
    private point: Point;
    public cityGroup: THREE.Group;
    private ligthTexture: THREE.Texture;
    public css3DRenderer: CSS3DRenderer;
    constructor(radius: number, textures: THREE.Texture, point: Point, ligthTexture: THREE.Texture) {
        this.radius = radius;
        this.textures = textures;
        this.point = point;
        this.ligthTexture = ligthTexture;
        this.cityGroup = new THREE.Group();
        this.clock = new THREE.Clock();
        this.css3DRenderer = new CSS3DRenderer()
        this.init();
    }

    init() {
        const cityMaterial = new THREE.MeshBasicMaterial({
            color: "#FF8C00",
            map: this.textures,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
        });

        const curPoint = lon2xyz(this.radius, this.point.E, this.point.N);
        this.addLight(curPoint);

        const curCity = new THREE.Mesh(
            new THREE.CircleGeometry(3, 32),
            cityMaterial
        );
        curCity.position.set(curPoint.x, curPoint.y, curPoint.z);
        curCity.lookAt(new THREE.Vector3(0, 0, 0));
        this.addLabel(curPoint); // 将 curPoint 传递给 addLabel 方法
        this.cityGroup.add(curCity);
        setTimeout(() => {
            this.cityPointsAnimation(curCity);
        }, Math.random() * 1000);
    };

    //添加标签
    addLabel(curPoint: THREE.Vector3) {
        console.log("addLabel", this.point.name)
        this.css3DRenderer.setSize(window.innerWidth, window.innerHeight);
        // HTML标签<div id="tag"></div>外面父元素叠加到canvas画布上且重合
        this.css3DRenderer.domElement.style.position = 'absolute';
        this.css3DRenderer.domElement.style.top = '0px';
        //设置.pointerEvents=none，解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
        this.css3DRenderer.domElement.style.pointerEvents = 'none';
        document.body.appendChild(this.css3DRenderer.domElement);

        const labelElement = document.createElement('div');
        labelElement.textContent = this.point.name;
        labelElement.style.fontSize = '12px';
        // labelElement.style.scale = "0.1";
        labelElement.style.color = 'white';
        // labelElement.style.backgroundColor = '';
        labelElement.style.padding = '2px 5px';
        labelElement.style.borderRadius = '3px';

        const labelObject = new CSS3DObject(labelElement);
        labelObject.position.set(curPoint.x, curPoint.y, curPoint.z);
        this.cityGroup.add(labelObject);
    };

    // 光柱动画
    addLight(curPoint: THREE.Vector3) {

        const lightGeometry = new THREE.ConeGeometry(0.5, 12, 60);
        const lightMaterial = new THREE.MeshBasicMaterial({
            // color: "#FF8C00",
            map: this.ligthTexture,
            transparent: true,
            // opacity: 1,
            side: THREE.DoubleSide,
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(curPoint.x, curPoint.y, curPoint.z);

        light.lookAt(new THREE.Vector3(0, 0, 0));
        light.rotateX(-Math.PI / 2);
        light.translateY(light.geometry.parameters.height / 2);

        // 设置圆锥体的方向
        this.cityGroup.add(light);
    }

    cityPointsAnimation(curCity: THREE.Mesh) {
        requestAnimationFrame(() => this.cityPointsAnimation(curCity));

        if (!curCity) {
            return;
        }

        const elapsedTime = this.clock.getElapsedTime();
        const animationDuration = 3; // 动画周期为2秒
        const progress = (elapsedTime % animationDuration) / animationDuration;

        // 使用正弦函数来平滑动画效果
        const scale = 0.5 + progress; // 缩放从1到2
        curCity.scale.set(scale, scale, scale);

        const opacity = Math.sin(progress * Math.PI); // 使用正弦函数 透明度从0到1到0
        (curCity.material as THREE.MeshBasicMaterial).opacity = opacity;
    };
}