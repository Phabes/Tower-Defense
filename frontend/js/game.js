import * as THREE from "three";
import $ from "jquery";
import { getLevels } from "./net";

export class Game {
  constructor() {
    this.createGame();

    getLevels().done((res) => {
      const levels = res.levels;
      console.log(levels);
    });
  }

  createGame = () => {
    const board = $("#board");

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const camera = new THREE.PerspectiveCamera(
      75,
      board.width() / board.height()
    );
    camera.position.z = 300;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(board.width(), board.height());
    renderer.render(scene, camera);

    board.append(renderer.domElement);
  };
}
