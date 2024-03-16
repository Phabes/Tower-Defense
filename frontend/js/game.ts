import * as THREE from "three";
import { getLevels } from "./net";
import { Board } from "./board";
import { Player } from "./player";
import { showSelectLevel, windowResize } from "./ui";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Level } from "./types";

export class Game {
  levels: Level[];
  scene: THREE.Scene;
  camera: Camera;
  renderer: Renderer;
  player: Player;
  board: Board;

  constructor(scene: THREE.Scene, camera: Camera, renderer: Renderer) {
    this.levels = [];

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.player = new Player(20, 500);
    this.board = new Board(this);

    this.retrieveLevels();
    windowResize(camera, renderer);
  }

  retrieveLevels = () => {
    getLevels().done((res) => {
      const levels = res.levels;
      this.levels = levels;
      showSelectLevel(this.levels.length, this.player.level, this.prepareGame);
    });
  };

  levelCompleted = (level: Level) => {
    const index = this.levels.indexOf(level);
    this.player.changePlayerLevel(index + 1);
    this.player.levelCompleted();
    showSelectLevel(this.levels.length, this.player.level, this.prepareGame);
  };

  prepareGame = (index: number) => {
    this.board.setLevel(this.levels[index]);
    this.board.createBoard();
    this.camera.setCamera();
    this.renderer.renderGame();
    this.board.prepareRound(0);
  };

  startRound = () => {
    this.board.startRound();
  };
}
