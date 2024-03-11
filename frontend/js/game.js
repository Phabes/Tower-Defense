import { getLevels } from "./net";
import { Board } from "./board";
import { Panel } from "./panel";
import { Player } from "./player";
import { Camera } from "./camera";
import { Renderer } from "./renderer";

export class Game {
  constructor(scene, camera, renderer) {
    this.levels = [];

    this.scene = scene;
    this.camera = new Camera(this.scene, camera);
    this.renderer = new Renderer(this.scene, camera, renderer);
    this.player = new Player(20, 500);
    this.panel = new Panel(this);
    this.board = new Board(this);

    this.retrieveLevels();
  }

  retrieveLevels = () => {
    getLevels().done((res) => {
      const levels = res.levels;
      this.levels = levels;
      this.panel.showSelectLevel();
    });
  };

  levelCompleted = (level) => {
    const index = this.levels.indexOf(level);
    this.player.changePlayerLevel(index + 1);
    this.panel.showSelectLevel();
  };

  prepareGame = (index) => {
    this.board.setLevel(this.levels[index]);
    this.board.createBoard();
    this.panel.clearPanel();
    this.renderer.setRendererSize();
    // this.board.createPlayerStats();
    this.camera.setCamera();
    this.renderer.renderGame();
    this.board.prepareRound(0);
    // this.panel.setTimer(this.levels[index].waves[0].timer);
  };

  startRound = () => {
    this.board.startRound();
  };
}
