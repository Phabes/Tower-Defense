import * as THREE from "three";
import { settings } from "./settings";
import { Enemy } from "./enemy";
import { Field } from "./fields/field";
import { Game } from "./game";
import { Coord, Level } from "./types";
import { Building } from "./fields/building";
import { Path } from "./fields/path";
import {
  boardClick,
  boardOffClick,
  getBoardElement,
  setTimer,
  showPlayerStats,
} from "./ui";
import { Tower } from "./tower";

export class Board {
  game: Game;
  fields: Field[][];
  enemies: Enemy[];
  towers: Tower[];
  boardGroup: THREE.Group<THREE.Object3DEventMap>;
  enemiesGroup: THREE.Group<THREE.Object3DEventMap>;
  raycaster: THREE.Raycaster;
  level: Level;
  round: number;
  animations: number;
  selectedField: Field | null;
  // heart: THREE.Mesh<
  //   THREE.ExtrudeGeometry,
  //   THREE.MeshBasicMaterial,
  //   THREE.Object3DEventMap
  // >;
  // coin: THREE.Mesh<
  //   THREE.CylinderGeometry,
  //   THREE.MeshBasicMaterial,
  //   THREE.Object3DEventMap
  // >;

  constructor(game: Game) {
    this.game = game;
    this.fields = [];
    this.enemies = [];
    this.towers = [];
    this.boardGroup = new THREE.Group();
    this.enemiesGroup = new THREE.Group();
    this.raycaster = new THREE.Raycaster();
    this.selectedField = null;
  }

  click = (event: JQuery.ClickEvent) => {
    const pointer = new THREE.Vector2();
    const boardElement = getBoardElement();
    pointer.x = (event.clientX / boardElement.width()!) * 2 - 1;
    pointer.y = -(event.clientY / boardElement.height()!) * 2 + 1;
    this.raycaster.setFromCamera(pointer, this.game.camera);

    const intersects = this.raycaster.intersectObjects(
      this.boardGroup.children
    );
    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (this.selectedField) {
          this.selectedField.colorField(false);
          this.selectedField.showPanel(false, this.game.player);
        }
        if (object instanceof Building) {
          this.selectedField = object;
          this.selectedField.colorField(true);
          this.selectedField.showPanel(true, this.game.player);
        } else {
          this.selectedField = null;
        }
      }
    }
  };

  setLevel = (level: Level) => {
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
    this.setGroupPosition(this.boardGroup);

    const mapSizeY = this.level.map.length;
    for (let i = 0; i < this.level.map.length; i++) {
      const row: Field[] = [];
      for (let j = 0; j < this.level.map[i].length; j++) {
        const coord = { y: i, x: j };
        const fieldType = this.level.map[i][j].type;
        const field =
          fieldType == "building"
            ? new Building(coord, fieldType)
            : fieldType == "path"
            ? new Path(coord, fieldType)
            : new Field(coord, fieldType);
        if (fieldType == "building") {
          const building = field as Building;
          this.towers.push(building.tower);
        }
        row.push(field);
        this.boardGroup.add(field.createField(mapSizeY));
      }
      this.fields.push(row);
    }
    this.game.scene.add(this.boardGroup);

    this.setPath();
    boardClick(this.click);
    this.animate();
  };

  setGroupPosition = (element: THREE.Group) => {
    element.position.set(
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
  };

  setPath = () => {
    for (let i = 0; i < this.fields.length; i++) {
      for (let j = 0; j < this.fields[i].length; j++) {
        if (this.fields[i][j].type == "path") {
          const nextFields = this.findNextFields(
            this.level.map[i][j].nextCoords!
          );
          this.fields[i][j].setNextFields(nextFields);
        }
      }
    }
  };

  findNextFields = (coords: Coord[]) => {
    const nextFields: Field[] = [];
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

  prepareRound = (round: number) => {
    this.round = round;
    showPlayerStats(this.game.player);
    setTimer(this.level.waves[this.round].timer, this.startRound);
  };

  startRound = () => {
    this.enemies = [];
    this.spawnEnemies(this.level.waves[this.round].enemies);
    showPlayerStats(this.game.player);
  };

  spawnEnemies = (numberOfEnemies: number) => {
    this.setGroupPosition(this.enemiesGroup);
    this.game.scene.add(this.enemiesGroup);

    const startField = this.getRandomFirstField();
    for (let i = 0; i < numberOfEnemies; i++) {
      const enemy = new Enemy(
        settings.ENEMY_HP,
        settings.ENEMY_SPEED,
        settings.ENEMY_MONEY,
        startField,
        this.enemyFinishedPath
      );
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

  removeEnemy = (enemy: Enemy) => {
    const index = this.enemies.indexOf(enemy);
    this.enemies[index].setAlive(false);
    this.enemies[index].setActive(false);
    this.enemiesGroup.remove(enemy);
  };

  enemyFinishedPath = (enemy: Enemy) => {
    this.removeEnemy(enemy);
    this.game.player.takeDamage(1);
    showPlayerStats(this.game.player);
    if (this.game.player.hp == 0) {
      this.stop();
      this.game.createAlert("Game Over");
      return;
    }
    this.checkFinishRound();
  };

  enemyDied = (enemy: Enemy) => {
    this.removeEnemy(enemy);
    this.game.player.addMoney(enemy.money);
    showPlayerStats(this.game.player);
    if (this.selectedField) {
      this.selectedField.showPanel(true, this.game.player);
    }
    this.checkFinishRound();
  };

  checkFinishRound = () => {
    const activeEnemies = this.enemies.filter((e) => e.active).length;
    if (activeEnemies != 0) {
      return;
    }
    const nextRound = this.round + 1;
    if (nextRound >= this.level.waves.length) {
      this.stop();
      this.game.levelCompleted(this.level);
      return;
    }
    this.prepareRound(nextRound);
  };

  stop = () => {
    boardOffClick();
    cancelAnimationFrame(this.animations);
    this.deactivateTowers();
  };

  deactivateTowers = () => {
    for (const tower of this.towers) {
      tower.deactivate();
    }
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

    for (const tower of this.towers) {
      if (tower.active) {
        tower.clearBullets();
        for (const bullet of tower.bullets) {
          bullet.move(tower.building.position);
          if (bullet.checkCollision(tower.building.position)) {
            const enemyStillAlive = bullet.hitTarget();
            if (!enemyStillAlive) {
              this.enemyDied(bullet.target);
            }
            tower.removeBullet(bullet);
          }
        }

        const targets: Enemy[] = [];
        for (const enemy of this.enemies) {
          if (enemy.alive && tower.inRange(enemy.position)) {
            targets.push(enemy);
          }
        }
        tower.setTargets(targets);
      }
    }

    this.game.renderer.renderGame();
  };

  // createPlayerStats = () => {
  //   this.createHeart();
  //   this.createCoin();
  //   this.animate();
  // };

  // createHeart = () => {
  //   const heartShape = new THREE.Shape();
  //   heartShape.moveTo(0, 0);
  //   heartShape.bezierCurveTo(0, 0, -5, -25, -25, -25);
  //   heartShape.bezierCurveTo(-55, -25, -55, 10, -55, 10);
  //   heartShape.bezierCurveTo(-55, 30, -35, 52, 0, 70);
  //   heartShape.bezierCurveTo(35, 52, 55, 30, 55, 10);
  //   heartShape.bezierCurveTo(55, 10, 55, -25, 25, -25);
  //   heartShape.bezierCurveTo(10, -25, 0, 0, 0, 0);

  //   const extrudeSettings = {
  //     depth: 8,
  //     bevelEnabled: true,
  //     bevelSegments: 2,
  //     steps: 2,
  //     bevelSize: 1,
  //     bevelThickness: 1,
  //   };

  //   const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  //   this.heart = new THREE.Mesh(
  //     geometry,
  //     new THREE.MeshBasicMaterial({ color: 0xff0000 })
  //   );
  //   this.heart.position.set(-200, 400, 100);
  //   this.heart.rotation.z = Math.PI;
  //   this.heart.rotation.x = Math.PI / 2;

  //   this.game.scene.add(this.heart);
  // };

  // createCoin = () => {
  //   const geometry = new THREE.CylinderGeometry(45, 45, 10, 32);
  //   const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  //   this.coin = new THREE.Mesh(geometry, material);
  //   this.coin.position.set(200, 400, 100);
  //   this.game.scene.add(this.coin);
  // };
}
