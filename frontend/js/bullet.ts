import * as THREE from "three";
import { Enemy } from "./enemy";
import { settings } from "./settings";
import { Models } from "./models";

export class Bullet extends THREE.Object3D {
  target: Enemy;
  damage: number;

  constructor(target: Enemy, damage: number, startingPositionZ: number) {
    super();
    this.target = target;
    this.damage = damage;
    this.add(Models.getInstance().getBulletClone());
    this.position.setZ(startingPositionZ);
  }

  move = (towerPosition: THREE.Vector3) => {
    const boardBulletPosition = towerPosition.clone().add(this.position);
    const norm = this.target.position
      .clone()
      .sub(boardBulletPosition)
      .normalize();
    this.translateOnAxis(norm, settings.BULLET_SPEED);
  };

  checkCollision = (towerPosition: THREE.Vector3) => {
    const boardBulletPosition = towerPosition.clone().add(this.position);
    const distance = this.target.position.distanceTo(boardBulletPosition);
    return distance <= settings.ENEMY_HITBOX;
  };

  hitTarget = () => {
    return this.target.takeDamage(this.damage);
  };
}
