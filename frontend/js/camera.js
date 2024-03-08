import * as THREE from "three";
import $ from "jquery";

export class Camera {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
  }

  setCamera = () => {
    this.camera.position.set(0, -400, 800);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);
  };
}
