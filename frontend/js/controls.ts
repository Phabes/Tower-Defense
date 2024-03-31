import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Camera } from "./camera";

export class Controls extends OrbitControls {
  constructor(camera: Camera, domElement: HTMLCanvasElement) {
    super(camera, domElement);

    this.minAzimuthAngle = -Math.PI * (3 / 8);
    this.maxAzimuthAngle = Math.PI * (3 / 8);

    this.minPolarAngle = Math.PI / 2;
    this.maxPolarAngle = Math.PI * (7 / 8);

    this.minDistance = 500;
    this.maxDistance = 1500;
    this.enablePan = false;
  }
}
