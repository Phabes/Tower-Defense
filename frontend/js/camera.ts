import * as THREE from "three";
import { getBoardElement } from "./ui";

export class Camera extends THREE.PerspectiveCamera {
  constructor(scene: THREE.Scene) {
    const boardElement = getBoardElement();
    super(50, boardElement.width()! / boardElement.height()!);
    scene.add(this);
  }

  setCamera = () => {
    this.position.set(0, -600, 1000);
    this.lookAt(0, 0, 0);
  };
}
