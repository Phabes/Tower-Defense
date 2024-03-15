import * as THREE from "three";
import { Field } from "./field";

export class Enemy {
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
    const geometry = new THREE.SphereGeometry(50);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(
      this.currentField.position.x,
      this.currentField.position.y,
      this.currentField.position.z
    );
    return this.mesh;
  };

  move = () => {
    if (this.nextField == null) {
      return;
    }
    const direction = new THREE.Vector3(
      this.nextField.coord.x - this.currentField.coord.x,
      -(this.nextField.coord.y - this.currentField.coord.y)
    );
    this.mesh.position.add(direction.multiplyScalar(this.speed));
    if (this.checkFieldChange()) {
      this.currentField = this.nextField;
      this.nextField = this.nextField.getRandomNextField();
      if (this.nextField == null) {
        this.enemyFinishedPath(this);
      }
    }
  };

  checkFieldChange = () => {
    if (this.nextField == null) {
      return false;
    }
    const distanceToEnemy = this.currentField.position.distanceTo(
      this.mesh.position
    );
    const distanceToNextField = this.currentField.position.distanceTo(
      this.nextField.position
    );
    return distanceToEnemy >= distanceToNextField;
  };
}
