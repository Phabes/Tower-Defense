import * as THREE from "three";
import $ from "jquery";

export class Camera {
  constructor(game, camera) {
    this.game = game;
    this.camera = camera;
  }

  setCamera = () => {
    this.camera.position.set(0, -400, 800);
    this.camera.lookAt(0, 0, 0);
    this.game.scene.add(this.camera);
  };
}
