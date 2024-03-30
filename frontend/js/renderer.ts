import * as THREE from "three";
import { getBoardElement } from "./ui";
import { Camera } from "./camera";

export class Renderer extends THREE.WebGLRenderer {
  scene: THREE.Scene;
  camera: Camera;

  constructor(scene: THREE.Scene, camera: Camera) {
    super();
    this.scene = scene;
    this.camera = camera;

    const boardElement = getBoardElement();
    this.setRendererSize(boardElement);
    this.addRenderer(boardElement);
  }

  setRendererSize = (boardElement: JQuery<HTMLElement>) => {
    boardElement.empty();
    this.setSize(boardElement.width()!, boardElement.height()!);

    this.addRenderer(boardElement);
    this.renderGame();
  };

  addRenderer = (boardElement: JQuery<HTMLElement>) => {
    boardElement.append(this.domElement);
  };

  renderGame = () => {
    this.render(this.scene, this.camera);
  };
}
