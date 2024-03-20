import * as THREE from "three";
import { settings } from "./settings";
import { Building } from "./fields/building";
import { Upgrade } from "./upgrade";
import { Bullet } from "./bullet";
import { Enemy } from "./enemy";

export class Tower extends THREE.Mesh {
  building: Building;
  active: boolean;
  activeCost: Upgrade;
  range: Upgrade;
  power: Upgrade;
  speed: Upgrade;
  targets: Enemy[];
  bullets: Bullet[];
  shooting: number;
  upgradeBuilding: () => void;

  constructor(building: Building, upgradeBuilding: () => void) {
    super();
    this.building = building;
    this.active = false;
    this.activeCost = new Upgrade(1, 0, 200, 0, this.activate);
    this.range = new Upgrade(
      2,
      settings.FIELD_SIZE + settings.FIELD_SIZE / 2,
      300,
      1,
      this.rebuildTower
    );
    this.power = new Upgrade(2, 50, 250, 50, this.rebuildTower);
    this.speed = new Upgrade(2, 600, 200, -200, this.rebuildTower);
    this.targets = [];
    this.bullets = [];
    this.shooting = 0;
    this.upgradeBuilding = upgradeBuilding;
    this.material = new THREE.MeshBasicMaterial({ color: 0xf59440 });
  }

  setTargets = (targets: Enemy[]) => {
    this.targets = targets;
  };

  clearBullets = () => {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (!this.bullets[i].target.active) {
        this.remove(this.bullets[i]);
        this.bullets.splice(i, 1);
      }
    }
  };

  removeBullet = (bullet: Bullet) => {
    const index = this.bullets.findIndex((element) => element === bullet);
    this.remove(bullet);
    this.bullets.splice(index, 1);
  };

  shootInterval = () => {
    clearInterval(this.shooting);

    this.shooting = setInterval(() => {
      if (this.targets.length > 0) {
        this.shoot();
      }
    }, this.speed.value);
  };

  shoot = () => {
    const target = this.chooseTarget();
    const height = settings.TOWER_DEFAULT_SIZE;
    const positionZ = this.building.position.z + height / 2;
    const bullet = new Bullet(target, positionZ);
    this.add(bullet);
    this.bullets.push(bullet);
  };

  rebuildTower = () => {
    this.shootInterval();
    this.upgradeTower();
    this.upgradeBuilding();
  };

  activate = () => {
    this.active = true;
    this.rebuildTower();
  };

  deactivate = () => {
    this.active = false;
    clearInterval(this.shooting);
  };

  upgradeTower = () => {
    const height = settings.TOWER_DEFAULT_SIZE;

    this.geometry = new THREE.BoxGeometry(
      settings.TOWER_DEFAULT_SIZE,
      settings.TOWER_DEFAULT_SIZE,
      height
    );
    this.position.setZ(this.building.position.z + height / 2);
  };

  inRange = (objectPosition3d: THREE.Vector3) => {
    const towerPosition = new THREE.Vector2(
      this.building.position.x,
      this.building.position.y
    );
    const objectPosition2d = new THREE.Vector2(
      objectPosition3d.x,
      objectPosition3d.y
    );
    const distanceBetween = towerPosition.distanceTo(objectPosition2d);
    const distanceRange = this.range.value;

    return distanceBetween <= distanceRange;
  };

  chooseTarget = () => {
    return this.targets[Math.floor(Math.random() * this.targets.length)];
  };
}
