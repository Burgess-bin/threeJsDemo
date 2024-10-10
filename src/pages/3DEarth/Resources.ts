import * as THREE from 'three';

const fileSuffix = [
    'gradient',
    'redCircle',
    "label",
    "aperture",
    'earth_aperture',
    'light_column',
    'aircraft',
    'earth',
    "glow"
]

export class Resources {
    private callback: () => void;
    public textures: { [key: string]: THREE.Texture };
    private manager: THREE.LoadingManager;
    private textureLoader: THREE.TextureLoader;
    constructor(callback: () => void) {
        this.callback = callback;
        this.textures = {};
        this.manager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.setLoadingManager();
        this.loadResources();
    };

    // 设置加载管理器
    private setLoadingManager() {
        this.manager.onStart = () => {
            console.log('start')
        }
        this.manager.onLoad = () => {
            console.log('load');
            this.callback();
        }
        this.manager.onError = (url) => {
            console.log('error', url)
        }
    }

    // 加载资源
    private loadResources() {
        const textures = fileSuffix.map(item => {
            const extension = item === 'earth' ? '.jpg' : '.png';
            return {
                name: item,
                url: `/earth/${item}${extension}`
            }
        });
        console.log("textures", textures)
        textures?.forEach((item) => {
            this.textureLoader.load(item.url, (t) => {
                this.textures[item.name] = t
            })
        })
    }
}