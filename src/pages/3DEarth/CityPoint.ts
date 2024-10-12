import * as THREE from 'three';
import { lon2xyz } from './util/common';
import html2canvas from 'html2canvas';

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
    constructor(radius: number, textures: THREE.Texture, point: Point, ligthTexture: THREE.Texture) {
        this.radius = radius;
        this.textures = textures;
        this.point = point;
        this.ligthTexture = ligthTexture;
        this.cityGroup = new THREE.Group();
        this.clock = new THREE.Clock();
        this.init();
    };

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
    async addLabel(curPoint: THREE.Vector3) {
        const html2canvasEle = document.getElementById('html2canvas');
        if (!html2canvasEle) return;
        html2canvasEle.innerHTML = `<div class="fire-div">${this.point.name}</div>`

        const opts = {
            backgroundColor: null, // 背景透明
            scale: 6,
            dpi: window.devicePixelRatio,
        };

        const canvas = await html2canvas(html2canvasEle, opts);
        const dataUrl = canvas.toDataURL();
        const map = new THREE.TextureLoader().load(dataUrl);
        const material = new THREE.SpriteMaterial({ map, transparent: true });
        const sprite = new THREE.Sprite(material);
        const len = 5 + (this.point.name.length - 2) * 2;
        sprite.scale.set(len, 3, 1);
        sprite.position.set(curPoint.x * 1.1, curPoint.y * 1.1, curPoint.z * 1.1);
        this.cityGroup.add(sprite);
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