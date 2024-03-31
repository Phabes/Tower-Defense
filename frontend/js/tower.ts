import * as THREE from "three";
import { settings } from "./settings";
import { Building } from "./fields/building";
import { Upgrade } from "./upgrade";
import { Bullet } from "./bullet";
import { Enemy } from "./enemy";
import { Models } from "./models";

export class Tower extends THREE.Mesh {
  building: Building;
  active: boolean;
  activeCost: Upgrade;
  range: Upgrade;
  power: Upgrade;
  frequency: Upgrade;
  targets: Enemy[];
  bullets: Bullet[];
  shooting: NodeJS.Timeout;
  towerContainer: THREE.Object3D;
  height: number;
  upgradeBuilding: () => void;

  constructor(building: Building, upgradeBuilding: () => void) {
    super();
    this.building = building;
    this.active = false;
    this.activeCost = new Upgrade("Activate", 1, 0, 200, 0, this.activate);
    this.range = new Upgrade(
      "Range",
      2,
      settings.FIELD_SIZE + settings.FIELD_SIZE / 2,
      300,
      1,
      this.rebuildTower
    );
    this.power = new Upgrade("Power", 2, 50, 250, 50, this.rebuildTower);
    this.frequency = new Upgrade(
      "Frequency",
      1,
      600,
      200,
      -200,
      this.upgradeFrequency
    );
    this.targets = [];
    this.bullets = [];
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
    }, this.frequency.value);
  };

  shoot = () => {
    const target = this.chooseTarget();
    const positionZ = this.building.position.z + this.height;
    const bullet = new Bullet(target, this.power.value, positionZ);
    this.add(bullet);
    this.bullets.push(bullet);
  };

  activate = () => {
    this.active = true;
    this.upgradeFrequency();
  };

  upgradeFrequency = () => {
    this.shootInterval();
    this.rebuildTower();
  };

  rebuildTower = () => {
    this.upgradeTower();
    this.upgradeBuilding();
  };

  deactivate = () => {
    this.active = false;
    clearInterval(this.shooting);
  };

  upgradeTower = () => {
    this.towerContainer = Models.getInstance().getTowerModelClone();
    this.calculateTowerHeight();
    this.add(this.towerContainer);
  };

  calculateTowerHeight = () => {
    const size = new THREE.Vector3();
    new THREE.Box3().setFromObject(this.towerContainer).getSize(size);
    this.height = size.z;
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
