import * as THREE from "three";

export class Enemy {
  constructor(hp, speed, currentField, enemyFinishedPath) {
    this.hp = hp;
    this.speed = speed;
    this.currentField = currentField;
    this.nextField = currentField.getRandomNextField();
    this.enemyFinishedPath = enemyFinishedPath;
  }

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
    const direction = new THREE.Vector3(
      this.nextField.x - this.currentField.x,
      -(this.nextField.y - this.currentField.y)
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
    const distanceToEnemy = this.currentField.position.distanceTo(
      this.mesh.position
    );
    const distanceToNextField = this.currentField.position.distanceTo(
      this.nextField.position
    );
    return distanceToEnemy >= distanceToNextField;
  };
}
