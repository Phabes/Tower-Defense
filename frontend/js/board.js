import * as THREE from "three";
import $ from "jquery";

export class Board {
  constructor(board) {
    this.squareSize = 100;
    this.spaceBetween = 2;
    this.createBoard(board);
  }

  createBoard = (board) => {
    const boardElement = $("#board");

    const scene = new THREE.Scene();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const geometry = new THREE.PlaneGeometry(
          this.squareSize,
          this.squareSize
        );
        const material = new THREE.MeshBasicMaterial({
          color: board[i][j].type == "grass" ? 0x00ff00 : 0xffff00,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          j * (this.squareSize + this.spaceBetween) + this.squareSize / 2,
          (board.length - i - 1) * (this.squareSize + this.spaceBetween) +
            this.squareSize / 2,
          0
        );
        scene.add(mesh);
      }
    }

    const camera = new THREE.PerspectiveCamera(
      50,
      boardElement.width() / boardElement.height()
    );
    camera.position.set(
      (board[0].length * this.squareSize + (board[0].length - 1) * 2) / 2,
      (board.length * this.squareSize + (board.length - 1) * 2) / 2,
      800
    );
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(boardElement.width(), boardElement.height());
    renderer.render(scene, camera);

    boardElement.append(renderer.domElement);
  };
}
