import * as THREE from "three";

export class Board {
  constructor(game) {
    this.game = game;
    this.squareSize = 100;
    this.spaceBetween = 4;
  }

  createBoard = (board) => {
    const game = new THREE.Group();
    game.position.set(
      -(board[0].length * this.squareSize + (board[0].length - 1) * 2) / 2,
      -(board.length * this.squareSize + (board.length - 1) * 2) / 2,
      0
    );

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const geometry = new THREE.PlaneGeometry(
          this.squareSize,
          this.squareSize
        );
        const material = new THREE.MeshBasicMaterial({
          color:
            board[i][j].type == "grass"
              ? 0x00ff00
              : board[i][j].type == "path"
              ? 0xffff00
              : 0xff0000,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          j * (this.squareSize + this.spaceBetween) + this.squareSize / 2,
          (board.length - i - 1) * (this.squareSize + this.spaceBetween) +
            this.squareSize / 2,
          0
        );
        game.add(mesh);
      }
    }
    this.game.scene.add(game);
  };

  createPlayerStats = () => {
    this.createHeart();
    this.createCoin();
    this.animate();
  };

  createHeart = () => {
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0, -5, -25, -25, -25);
    heartShape.bezierCurveTo(-55, -25, -55, 10, -55, 10);
    heartShape.bezierCurveTo(-55, 30, -35, 52, 0, 70);
    heartShape.bezierCurveTo(35, 52, 55, 30, 55, 10);
    heartShape.bezierCurveTo(55, 10, 55, -25, 25, -25);
    heartShape.bezierCurveTo(10, -25, 0, 0, 0, 0);

    const extrudeSettings = {
      depth: 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1,
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    this.heart = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.heart.position.set(-200, 400, 100);
    this.heart.rotation.z = Math.PI;
    this.heart.rotation.x = Math.PI / 2;

    this.game.scene.add(this.heart);
  };

  createCoin = () => {
    const geometry = new THREE.CylinderGeometry(45, 45, 10, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.coin = new THREE.Mesh(geometry, material);
    this.coin.position.set(200, 400, 100);

    this.game.scene.add(this.coin);
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    this.heart.rotation.y += 0.01;
    this.coin.rotation.z += 0.01;

    this.game.renderer.renderGame();
  };
}
