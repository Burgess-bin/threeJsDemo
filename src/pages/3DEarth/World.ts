import * as THREE from 'three';
import { Basic } from './Basic';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Sizes } from './Sizes';
import { Resources } from './Resources';
import { Earth } from './Earth';
import Data from './Data';

export class World extends THREE.Object3D {
    private domElement: HTMLDivElement;
    private basic: Basic;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private camera: THREE.PerspectiveCamera;
    private sizes: Sizes;
    private resources: Resources;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    private earth: Earth;
    constructor(domElement: HTMLDivElement) {
        super();
        this.domElement = domElement;
        this.basic = new Basic(this.domElement);

        // 初始化场景、渲染器、控制器、相机
        this.scene = this.basic.scene;
        this.renderer = this.basic.renderer;
        this.controls = this.basic.controls;
        this.camera = this.basic.camera;
        this.sizes = new Sizes({ dom: this.domElement });

        // 初始化资源
        this.resources = new Resources(async () => {
            this.createEarth();
            this.animation();
        })

        // 监听控制器变化
        this.controls.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera)
        })

        // 监听窗口大小变化
        this.sizes.$on('resize', () => {
            this.renderer.setSize(Number(this.sizes.viewport.width), Number(this.sizes.viewport.height))
            this.camera.aspect = Number(this.sizes.viewport.width) / Number(this.sizes.viewport.height)
            this.camera.updateProjectionMatrix()
            this.renderer.render(this.scene, this.camera)
        })
    }

    dispose() {
        this.basic.dispose();
        this.scene.clear();
        this.renderer.dispose();
    };

    animation() {
        requestAnimationFrame(() => this.animation());
        this.renderer.render(this.scene, this.camera);
        if (this.controls) {
            this.controls.update();
        }
        if (this.earth) {
            this.earth.render();
        }
    }

    createEarth() {
        this.earth = new Earth({
            data: Data,
            dom: this.domElement,
            textures: this.resources.textures,
            earth: {
                radius: 50,
                rotateSpeed: 0.002,
                isRotation: true
            },
            satellite: {
                show: true,
                rotateSpeed: -0.01,
                size: 1,
                number: 2
            },
            punctuation: {
                circleColor: 0x3892ff,
                lightColumn: {
                    startColor: 0xe4007f, // 起点颜色
                    endColor: 0xffffff, // 终点颜色
                },
            },
            flyLine: {
                color: 0xf3ae76, // 飞线的颜色
                flyLineColor: 0xff7714, // 飞行线的颜色
                speed: 0.004, // 拖尾飞线的速度
            }
        }, this.scene, this.camera);
        console.log(this.earth);
    }

}