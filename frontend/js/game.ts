import * as THREE from "three";
import { getLevels } from "./net";
import { Board } from "./board";
import { Panel } from "./panel";
import { Player } from "./player";
import { windowResize } from "./ui";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Level } from "./types";

export class Game {
  levels: Level[];
  scene: THREE.Scene;
  camera: Camera;
  renderer: Renderer;
  player: Player;
  panel: Panel;
  board: Board;
  constructor(scene: THREE.Scene, camera: Camera, renderer: Renderer) {
    this.levels = [];

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.player = new Player(20, 500);
    this.panel = new Panel(this);
    this.board = new Board(this);

    this.retrieveLevels();
    windowResize(camera, renderer);
  }

  retrieveLevels = () => {
    getLevels().done((res) => {
      const levels = res.levels;
      this.levels = levels;
      this.panel.showSelectLevel();
    });
  };

  levelCompleted = (level: Level) => {
    const index = this.levels.indexOf(level);
    this.player.changePlayerLevel(index + 1);
    this.player.levelCompleted();
    this.panel.showSelectLevel();
  };

  prepareGame = (index: number) => {
    this.board.setLevel(this.levels[index]);
    this.board.createBoard();
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
