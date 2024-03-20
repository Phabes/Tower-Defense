import * as THREE from "three";
import { Field } from "./fields/field";
import { settings } from "./settings";

export class Enemy extends THREE.Mesh {
  hp: number;
  speed: number;
  currentField: Field;
  nextField: Field | null;
  enemyFinishedPath: (e: Enemy) => void;
  alive: boolean;
  active: boolean;
  mesh: THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >;

  constructor(
    hp: number,
    speed: number,
    currentField: Field,
    enemyFinishedPath: (e: Enemy) => void
  ) {
    super();
    this.hp = hp;
    this.speed = speed;
    this.currentField = currentField;
    this.nextField = currentField.getRandomNextField();
    this.enemyFinishedPath = enemyFinishedPath;
    this.alive = false;
    this.active = true;
  }

  setAlive = (alive: boolean) => {
    this.alive = alive;
  };

  setActive = (active: boolean) => {
    this.active = active;
  };

  spawn = () => {
    this.geometry = new THREE.SphereGeometry(settings.ENEMY_SIZE);
    this.material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    this.position.set(
      this.currentField.position.x,
      this.currentField.position.y,
      this.currentField.position.z
    );
    return this;
  };

  move = () => {
    if (!this.nextField) {
      return;
    }
    const moveVector = this.nextField.position
      .clone()
      .sub(this.currentField.position)
      .normalize();
    this.translateOnAxis(moveVector, this.speed);
    if (this.checkFieldChange()) {
      this.currentField = this.nextField;
      this.nextField = this.nextField.getRandomNextField();
      if (!this.nextField) {
        this.enemyFinishedPath(this);
      }
    }
  };

  checkFieldChange = () => {
    if (!this.nextField) {
      return false;
    }
    const distanceToEnemy = this.currentField.position.distanceTo(
      this.position
    );
    const distanceToNextField = this.currentField.position.distanceTo(
      this.nextField.position
    );
    return distanceToEnemy >= distanceToNextField;
  };

  takeDamage = (damage: number) => {
    this.hp -= damage;
    return this.hp > 0;
  };
}
