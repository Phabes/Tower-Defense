import * as THREE from "three";
import { getBoardElement } from "./ui";

export class Renderer extends THREE.WebGLRenderer {
  constructor(scene, camera) {
    super();
    this.scene = scene;
    this.camera = camera;

    const boardElement = getBoardElement();
    this.setRendererSize(boardElement);
    this.addRenderer(boardElement);
  }

  setRendererSize = (boardElement) => {
    boardElement.empty();
    this.setSize(boardElement.width(), boardElement.height());

    this.addRenderer(boardElement);
    this.renderGame();
  };

  addRenderer = (boardElement) => {
    boardElement.append(this.domElement);
  };

  renderGame = () => {
    this.render(this.scene, this.camera);
  };
}
