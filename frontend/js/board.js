import * as THREE from "three";
import { Enemy } from "./enemy";
import { settings } from "./settings";
import { Field } from "./field";
import { boardClick, getBoardElement } from "./ui";

export class Board {
  constructor(game) {
    this.game = game;
    this.fields = [];
    this.enemies = [];
    this.boardGroup = new THREE.Group();
    this.enemiesGroup = new THREE.Group();
    this.raycaster = new THREE.Raycaster();
    boardClick(this.click);
  }

  click = (event) => {
    const pointer = new THREE.Vector2();
    const boardElement = getBoardElement();
    pointer.x = (event.clientX / boardElement.width()) * 2 - 1;
    pointer.y = -(event.clientY / boardElement.height()) * 2 + 1;
    this.raycaster.setFromCamera(pointer, this.game.camera);

    const intersects = this.raycaster.intersectObjects(
      this.boardGroup.children
    );
    if (intersects.length > 0) {
      console.log(intersects);
      for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.material.color.set(0xff0000);
      }
    }
  };

  setLevel = (level) => {
    this.level = level;
  };

  clearBoard = () => {
    this.boardGroup.clear();
    this.fields = [];
    this.enemiesGroup.clear();
    this.enemies = [];
  };

  createBoard = () => {
    this.clearBoard();
    this.boardGroup.position.set(
      -(
        this.level.map[0].length * settings.FIELD_SIZE +
        (this.level.map[0].length - 1) * 2
      ) / 2,
      -(
        this.level.map.length * settings.FIELD_SIZE +
        (this.level.map.length - 1) * 2
      ) / 2,
      0
    );

    for (let i = 0; i < this.level.map.length; i++) {
      const row = [];
      for (let j = 0; j < this.level.map[i].length; j++) {
        const field = new Field(
          i,
          j,
          this.level.map[i][j].type,
          this.level.map.length
        );
        row.push(field);
        this.boardGroup.add(field.createField());
        // this.game.scene.add(field.createField());
      }
      this.fields.push(row);
    }
    this.game.scene.add(this.boardGroup);

    this.setPath();
    this.animate();
  };

  setPath = () => {
    for (let i = 0; i < this.fields.length; i++) {
      for (let j = 0; j < this.fields[i].length; j++) {
        if (this.fields[i][j].type == "path") {
          const nextFields = this.findNextFields(
            this.level.map[i][j].nextFields
          );
          this.fields[i][j].setNextFields(nextFields);
        }
      }
    }
  };

  findNextFields = (coords) => {
    const nextFields = [];
    for (const coord of coords) {
      nextFields.push(this.fields[coord.y][coord.x]);
    }
    return nextFields;
  };

  getRandomFirstField = () => {
    const coordIndex = Math.floor(
      Math.random() * this.level.startingCoords.length
    );
    const startingCoord = this.level.startingCoords[coordIndex];
    return this.fields[startingCoord.y][startingCoord.x];
  };

  prepareRound = (round) => {
    this.round = round;
    this.game.panel.setTimer(this.level.waves[this.round].timer);
  };

  startRound = () => {
    this.enemies = [];
    this.spawnEnemies(this.level.waves[this.round].enemies);
    this.game.panel.showPlayerStats(this.game.player);
  };

  spawnEnemies = (numberOfEnemies) => {
    this.boardGroup.add(this.enemiesGroup);

    const startField = this.getRandomFirstField();
    for (let i = 0; i < numberOfEnemies; i++) {
      const enemy = new Enemy(100, 10, startField, this.enemyFinishedPath);
      this.enemies.push(enemy);
    }

    let index = 0;
    this.enemiesGroup.add(this.enemies[index].spawn());
    this.enemies[index].setAlive(true);
    const interval = setInterval(() => {
      index++;
      if (index == numberOfEnemies) {
        clearInterval(interval);
        return;
      }
      this.enemiesGroup.add(this.enemies[index].spawn());
      this.enemies[index].setAlive(true);
    }, 1000);
  };

  enemyFinishedPath = (enemy) => {
    const index = this.enemies.indexOf(enemy);
    this.enemies[index].setAlive(false);
    this.enemies[index].setActive(false);
    // this.enemies.splice(index, 1);
    this.enemiesGroup.remove(enemy.mesh);
    this.game.player.takeDamage(1);
    this.game.panel.showPlayerStats(this.game.player);
    if (this.game.player.hp == 0) {
      cancelAnimationFrame(this.animations);
      return;
    }
    const activeEnemies = this.enemies.filter((e) => e.active).length;
    if (activeEnemies == 0) {
      const nextRound = this.round + 1;
      if (nextRound >= this.level.waves.length) {
        console.log("level completed");
        cancelAnimationFrame(this.animations);
        this.game.levelCompleted(this.level);
        return;
      }
      this.prepareRound(nextRound);
    }
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
    this.animations = requestAnimationFrame(this.animate);

    // this.heart.rotation.y += 0.01;
    // this.coin.rotation.z += 0.01;

    for (const enemy of this.enemies) {
      if (enemy.alive) {
        enemy.move();
      }
    }

    this.game.renderer.renderGame();
  };
}
