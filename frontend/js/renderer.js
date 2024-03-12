import $ from "jquery";

export class Renderer {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  setRendererSize = () => {
    const boardElement = $("#board");
    boardElement.empty();

    this.renderer.setSize(boardElement.width(), boardElement.height());

    boardElement.append(this.renderer.domElement);
    this.renderGame();
  };

  renderGame = () => {
    this.renderer.render(this.scene, this.camera);
  };
}
