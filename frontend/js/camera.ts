import * as THREE from "three";
import { getBoardElement } from "./ui";

export class Camera extends THREE.PerspectiveCamera {
  constructor() {
    const boardElement = getBoardElement();
    super(50, boardElement.width()! / boardElement.height()!);
  }

  setCamera = () => {
    this.position.set(0, -700, 1000);
    this.lookMiddleScene();
  };

  lookMiddleScene = () => {
    this.lookAt(0, 0, 0);
  };
}
