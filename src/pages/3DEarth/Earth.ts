import { Texture } from "three";
import * as THREE from 'three';
import earthVertex from './shaders/vertex.vs';
import earthFragment from './shaders/fragment.fs';
import cityData from './Data';
import { CityPoint } from "./CityPoint";

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
};

type uniforms = {
    glowColor: { value: THREE.Color; }
    scale: { type: string; value: number; }
    bias: { type: string; value: number; }
    power: { type: string; value: number; }
    time: { type: string; value: Date | number; }
    isHover: { value: boolean; };
    map: { value: Texture | null }
}


export class Earth {
    private options: options;
    private scene: THREE.Scene;
    public uniforms: uniforms;
    public timeValue: number;

    constructor(options: options, scene: THREE.Scene) {
        this.options = options;
        this.scene = scene;

        //扫光动画;
        this.timeValue = 100;
        this.uniforms = {
            glowColor: {
                value: new THREE.Color(0x0cd1eb),
            },
            scale: {
                type: "f",
                value: -1.0,
            },
            bias: {
                type: "f",
                value: 1.0,
            },
            power: {
                type: "f",
                value: 3.3,
            },
            time: {
                type: "f",
                value: this.timeValue,
            },
            isHover: {
                value: false,
            },
            map: {
                value: null,
            },
        };
        this.init();
    };

    init() {
        const earthGroup = new THREE.Group();
        const earthGeometry = new THREE.SphereGeometry(this.options.earth.radius, 64, 64);

        const earth_border = new THREE.SphereGeometry(
            this.options.earth.radius + 10,
            60,
            60
        );
        const pointMaterial = new THREE.PointsMaterial({
            color: 0x81ffff, //设置颜色，默认 0xFFFFFF
            transparent: true,
            sizeAttenuation: true,
            opacity: 0.1,
            vertexColors: false, //定义材料是否使用顶点颜色，默认false ---如果该选项设置为true，则color属性失效
            size: 0.01, //定义粒子的大小。默认为1.0
        })
        const points = new THREE.Points(earth_border, pointMaterial); //将模型添加到场景
        earthGroup.add(points);

        this.options.textures.earth.wrapS = this.options.textures.earth.wrapT =
            THREE.RepeatWrapping;
        this.uniforms.map.value = this.options.textures.earth;

        const earth_material = new THREE.ShaderMaterial({
            // wireframe:true, // 显示模型线条
            uniforms: this.uniforms,
            vertexShader: earthVertex,
            fragmentShader: earthFragment,
        });
        earth_material.needsUpdate = true;

        const earth = new THREE.Mesh(earthGeometry, earth_material);
        earthGroup.add(earth);
        this.addStarPoint();
        this.addGlowPoint(earthGroup);
        this.createEarthAperture(earthGroup);
        this.addCityPoint(earthGroup);
        this.scene.add(earthGroup);
    };

    //添加发光片精灵
    addGlowPoint(earthGroup: THREE.Group) {
        const R = this.options.earth.radius;
        // 创建精灵材质
        const spriteMaterial = new THREE.SpriteMaterial({
            map: this.options.textures.glow,
            color: 0x4390d1,
            transparent: true, //开启透明
            opacity: 0.7, // 可以通过透明度整体调节光圈
            depthWrite: false, //禁止写入深度缓冲区数据
        });
        // 创建精灵
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(R * 3.0, R * 3.0, 1); //适当缩放精灵
        earthGroup.add(sprite);
    };

    //添加辉光大气层
    createEarthAperture(earthGroup: THREE.Group) {

        const vertexShader = [
            "varying vec3	vVertexWorldPosition;",
            "varying vec3	vVertexNormal;",
            "varying vec4	vFragColor;",
            "void main(){",
            "	vVertexNormal	= normalize(normalMatrix * normal);", //将法线转换到视图坐标系中
            "	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;", //将顶点转换到世界坐标系中
            "	// set gl_Position",
            "	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
            "}",
        ].join("\n");

        //大气层效果
        const AeroSphere = {
            uniforms: {
                coeficient: {
                    type: "f",
                    value: 1.0,
                },
                power: {
                    type: "f",
                    value: 3,
                },
                glowColor: {
                    type: "c",
                    value: new THREE.Color(0x4390d1),
                },
            },
            vertexShader: vertexShader,
            fragmentShader: [
                "uniform vec3	glowColor;",
                "uniform float	coeficient;",
                "uniform float	power;",

                "varying vec3	vVertexNormal;",
                "varying vec3	vVertexWorldPosition;",

                "varying vec4	vFragColor;",

                "void main(){",
                "	vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;", //世界坐标系中从相机位置到顶点位置的距离
                "	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;", //视图坐标系中从相机位置到顶点位置的距离
                "	viewCameraToVertex= normalize(viewCameraToVertex);", //规一化
                "	float intensity	= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);",
                "	gl_FragColor = vec4(glowColor, intensity);",
                "}",
            ].join("\n"),
        };
        //球体 辉光 大气层
        const material1 = new THREE.ShaderMaterial({
            uniforms: AeroSphere.uniforms,
            vertexShader: AeroSphere.vertexShader,
            fragmentShader: AeroSphere.fragmentShader,
            blending: THREE.NormalBlending,
            transparent: true,
            depthWrite: false,
        });
        const sphere = new THREE.SphereGeometry(
            this.options.earth.radius + 0,
            64,
            64
        );
        const mesh = new THREE.Mesh(sphere, material1);
        earthGroup.add(mesh);
    }

    // 添加星星
    addStarPoint() {
        const vertexs = [];
        const colors = [];
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * 800 - 300;
            const y = Math.random() * 800 - 300;
            const z = Math.random() * 800 - 300;
            vertexs.push(x, y, z);
            colors.push(new THREE.Color(1, 1, 1));
        };

        const starMaterial = new THREE.PointsMaterial({
            color: 0x4d76cf,
            size: 2,
            sizeAttenuation: true, // 尺寸衰减
            transparent: true, // 透明
            opacity: 1,
            map: this.options.textures.gradient,
        });

        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertexs), 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        const star = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(star);
    };

    //城市坐标
    addCityPoint(earthGroup: THREE.Group) {
        const radius = this.options.earth.radius;
        const ligthTexture = this.options.textures.light_column;

        cityData.forEach(item => {
            const startCity = new CityPoint(radius, this.options.textures.label, item.startArray, ligthTexture as THREE.Texture);
            earthGroup.add(startCity.cityGroup);

            item.endArray.forEach(end => {
                const endCity = new CityPoint(radius, this.options.textures.label, end, ligthTexture as THREE.Texture);
                earthGroup.add(endCity.cityGroup);
            });
        });
    };
}