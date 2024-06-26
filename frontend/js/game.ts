import * as THREE from "three";
import { getLevels } from "./net";
import { Board } from "./board";
import { Player } from "./player";
import {
  refreshSelectOptions,
  removeWelcome,
  showAlert,
  showSelectLevel,
  startButtonClick,
  welcomeButtonsHandler,
  windowResize,
} from "./ui";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Level } from "./types";
import { Message } from "./message";
import { BoardCreator } from "./boardCreator";
import { Mailbox } from "./mailbox";
import { Controls } from "./controls";
import { Loading } from "./loading";

export class Game {
  levels: Level[];
  messages: Message[];
  scene: THREE.Scene;
  camera: Camera;
  renderer: Renderer;
  controls: Controls;
  player: Player;
  board: Board | undefined;

  constructor(
    scene: THREE.Scene,
    camera: Camera,
    renderer: Renderer,
    controls: Controls
  ) {
    this.levels = [];
    this.messages = [];

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.player = new Player(10, 500);

    this.retrieveLevels();
    welcomeButtonsHandler(this);
  }

  startGame = () => {
    removeWelcome();
    this.board = new Board(this);
    windowResize(this.camera, this.renderer);
    startButtonClick(this.prepareGame);
  };

  startLevelCreator = (width: number, height: number) => {
    if (this.board) this.board.clearBoard();
    this.board = new BoardCreator(this, width, height);
    this.board.createBoard();
    this.camera.setCamera();
    this.renderer.renderGame(this.scene, this.camera);
    windowResize(this.camera, this.renderer);
  };

  refreshLevelsSelection = () => {
    this.player.levelCompleted();
    refreshSelectOptions(this.levels.length, this.player.level);
    showSelectLevel();
  };

  retrieveLevels = () => {
    getLevels()
      .done((res) => {
        const levels = JSON.parse(res).levels;
        this.levels = levels;
        this.refreshLevelsSelection();
        Loading.getInstance().setLevelsLoaded(true);
      })
      .catch(() => {
        Loading.getInstance().setLevelsError(true);
      });
  };

  levelNotCompleted = () => {
    Mailbox.getInstance().deleteMessages();
    this.refreshLevelsSelection();
  };

  levelCompleted = (level: Level) => {
    const index = this.levels.indexOf(level);
    this.player.changePlayerLevel(index + 1);
    Mailbox.getInstance().deleteMessages();
    this.refreshLevelsSelection();
  };

  prepareGame = (index: number) => {
    if (this.board === undefined) {
      return;
    }
    this.board.setLevel(this.levels[index]);
    this.board.createBoard();
    this.camera.setCamera();
    this.renderer.renderGame(this.scene, this.camera);
    this.board.prepareRound(0);
  };

  startRound = () => {
    if (this.board === undefined) {
      return;
    }
    this.board.startRound();
  };

  createAlert = (alertMessage: string) => {
    showAlert(alertMessage, this.levelNotCompleted);
  };
}
