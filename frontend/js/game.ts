import * as THREE from "three";
import { getLevels } from "./net";
import { Board } from "./board";
import { Player } from "./player";
import {
  refreshSelectOptions,
  removeLoading,
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
  board: Board;

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

    welcomeButtonsHandler(this);
  }

  startGame = () => {
    removeWelcome();
    this.board = new Board(this)
    this.retrieveLevels();
    windowResize(this.camera, this.renderer);
    startButtonClick(this.prepareGame);
  }

  refreshLevelsSelection = () => {
    this.player.levelCompleted();
    refreshSelectOptions(this.levels.length, this.player.level);
    showSelectLevel();
  };

  startLevelCreator = (width:number, height:number) => {
    if (this.board)
      this.board.clearBoard()
    this.board = new BoardCreator(this, width, height);
    this.board.createBoard();
    this.camera.setCamera();
    this.renderer.renderGame();
    windowResize(this.camera, this.renderer);
  }

  refreshLevelsSelection = () => {
    this.player.levelCompleted();
    refreshSelectOptions(this.levels.length, this.player.level);
    showSelectLevel();
  };

  retrieveLevels = () => {
    getLevels()
      .done((res) => {
        const levels = res.levels;
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
    this.board.setLevel(this.levels[index]);
    this.board.createBoard();
    this.camera.setCamera();
    this.renderer.renderGame(this.scene, this.camera);
    this.board.prepareRound(0);
  };

  startRound = () => {
    this.board.startRound();
  };

  createAlert = (alertMessage: string) => {
    showAlert(alertMessage, this.levelNotCompleted);
  };
}
