import { Texture } from "three";
import * as THREE from 'three';
export type punctuation = {
    circleColor: number,
    lightColumn: {
        startColor: number, // 起点颜色
        endColor: number, // 终点颜色
    },
};

export type options = {
    data: {
        startArray: {
            name: string,
            E: number, // 经度
            N: number, // 维度
        },
        endArray: {
            name: string,
            E: number, // 经度
            N: number, // 维度
        }[]
    }[]
    dom: HTMLElement,
    textures: Record<string, Texture>, // 贴图
    earth: {
        radius: number, // 地球半径
        rotateSpeed: number, // 地球旋转速度
        isRotation: boolean // 地球组是否自转
    }
    satellite: {
        show: boolean, // 是否显示卫星
        rotateSpeed: number, // 旋转速度
        size: number, // 卫星大小
        number: number, // 一个圆环几个球
    },
    punctuation: punctuation,
    flyLine: {
        color: number, // 飞线的颜色
        speed: number, // 飞机拖尾线速度
        flyLineColor: number // 飞行线的颜色
    },
}


export class Earth {
    private options: options;
    private scene: THREE.Scene;
    constructor(options: options, scene: THREE.Scene) {
        this.options = options;
        this.scene = scene;
        this.init();
    };

    init() {
        const earthGeometry = new THREE.SphereGeometry(3, 64, 64);

        const earth_border = new THREE.SphereGeometry(
            this.options.earth.radius + 10,
            60,
            60
        );

        const earthMaterial = new THREE.MeshBasicMaterial({
            map: this.options.textures.earth
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.scene.add(earth);
    }
}