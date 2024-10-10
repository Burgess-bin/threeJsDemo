import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Basic {
    private domElement: HTMLDivElement;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public controls: OrbitControls;
    constructor(domElement: HTMLDivElement) {
        this.domElement = domElement;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.domElement.clientWidth / this.domElement.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 120);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.domElement.clientWidth, this.domElement.clientHeight);
        this.renderer.setClearColor(new THREE.Color(0, 0, 0));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.domElement.appendChild(this.renderer.domElement);
    }
    dispose() {
        this.renderer.dispose();
        this.domElement.removeChild(this.renderer.domElement);
    }
}