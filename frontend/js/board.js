import * as THREE from "three";
import { Enemy } from "./enemy";
import { settings } from "./settings";
import { Field } from "./field";

export class Board {
  constructor(game) {
    this.game = game;
    this.fields = [];
    this.enemies = [];
  }

  setLevel = (level) => {
    this.level = level;
  };

  createBoard = () => {
    this.boardGroup = new THREE.Group();
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
          this.fields[i][j].setNextFields(
            this.findNextFields(this.level.map[i][j].id + 1)
          );
        }
      }
    }
  };

  findNextFields = (id) => {
    const nextFields = [];
    for (const i in this.level.map) {
      for (const j in this.level.map[i]) {
        if (
          this.level.map[i][j].type == "path" &&
          this.level.map[i][j].id == id
        ) {
          nextFields.push(this.fields[i][j]);
        }
      }
    }
    return nextFields;
  };

  getRandomFirstField = (firstFields) => {
    return firstFields[Math.floor(Math.random() * firstFields.length)];
  };

  prepareRound = (round) => {
    this.round = round;
    this.game.panel.setTimer(this.level.waves[this.round].timer);
  };

  startRound = () => {
    this.spawnEnemies(this.level.waves[this.round].enemies);
    this.game.panel.showPlayerStats(this.game.player);
  };

  spawnEnemies = (numberOfEnemies) => {
    this.enemiesGroup = new THREE.Group();
    this.boardGroup.add(this.enemiesGroup);

    const startField = this.getRandomFirstField(this.findNextFields(0));
    const enemy = new Enemy(100, 10, startField, this.enemyFinishedPath);
    this.enemies.push(enemy);
    this.enemiesGroup.add(enemy.spawn());
    numberOfEnemies--;

    const interval = setInterval(() => {
      if (numberOfEnemies == 0) {
        clearInterval(interval);
        return;
      }
      const startField = this.getRandomFirstField(this.findNextFields(0));
      const enemy = new Enemy(100, 10, startField, this.enemyFinishedPath);
      this.enemies.push(enemy);
      this.enemiesGroup.add(enemy.spawn());
      numberOfEnemies--;
    }, 1000);
  };

  enemyFinishedPath = (enemy) => {
    const index = this.enemies.indexOf(enemy);
    this.enemies.splice(index, 1);
    this.enemiesGroup.remove(enemy.mesh);
    this.game.player.takeDamage(1);
    this.game.panel.showPlayerStats(this.game.player);
    if (this.game.player.hp == 0) {
      cancelAnimationFrame(this.animations);
      return;
    }
    if (this.enemies.length == 0) {
      const nextRound = this.round + 1;
      if (nextRound >= this.level.waves.length) {
        console.log("level completed");
        return;
      }
      this.prepareRound(this.round + 1);
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
      enemy.move();
    }

    this.game.renderer.renderGame();
  };
}
