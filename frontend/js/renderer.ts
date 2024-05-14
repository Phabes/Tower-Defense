import * as THREE from "three";
import { getBoardElement } from "./ui";
import { Camera } from "./camera";

export class Renderer extends THREE.WebGLRenderer {
  constructor() {
    super();
    const boardElement = getBoardElement();
    this.setRendererSize(boardElement);
    this.addRenderer(boardElement);
  }

  setRendererSize = (boardElement: JQuery<HTMLElement>) => {
    boardElement.empty();
    this.setSize(boardElement.width()!, boardElement.height()!);

    this.addRenderer(boardElement);
  };

  addRenderer = (boardElement: JQuery<HTMLElement>) => {
    boardElement.append(this.domElement);
  };

  renderGame = (scene: THREE.Scene, camera: Camera) => {
    camera.lookMiddleScene();
    this.render(scene, camera);
  };
}
