import * as THREE from "three";
import { Enemy } from "./enemy";
import { settings } from "./settings";

export class Bullet extends THREE.Mesh {
  target: Enemy;
  damage: number;

  constructor(target: Enemy, damage: number, startingPositionZ: number) {
    super();
    this.target = target;
    this.damage = damage;
    this.material = new THREE.MeshBasicMaterial({ color: 0x34deeb });
    this.geometry = new THREE.SphereGeometry(settings.BULLET_SIZE);
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
    return distance <= settings.ENEMY_SIZE;
  };

  hitTarget = () => {
    return this.target.takeDamage(this.damage);
  };
}
