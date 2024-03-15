import * as THREE from "three";
import $ from "jquery";
import { getBoardElement } from "./ui";

export class Camera extends THREE.PerspectiveCamera {
  constructor(scene) {
    const boardElement = getBoardElement();
    super(50, boardElement.width() / boardElement.height());
    scene.add(this);
  }

  setCamera = (se) => {
    this.position.set(0, -600, 1000);
    this.lookAt(0, 0, 0);
  };
}
