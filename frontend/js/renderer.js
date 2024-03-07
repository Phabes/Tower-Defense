import $ from "jquery";

export class Renderer {
  constructor(game, camera, renderer) {
    this.game = game;
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
    this.renderer.render(this.game.scene, this.camera);
  };
}
