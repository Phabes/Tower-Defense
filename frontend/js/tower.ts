import * as THREE from "three";
import { settings } from "./settings";
import { Building } from "./fields/building";
import { Upgrade } from "./upgrade";

export class Tower extends THREE.Mesh {
  building: Building;
  active: boolean;
  activeCost: Upgrade;
  range: Upgrade;
  power: Upgrade;
  speed: Upgrade;
  shooting: boolean;
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
    this.speed = new Upgrade(2, 20, 200, 20, this.rebuildTower);
    this.shooting = false;
    this.upgradeBuilding = upgradeBuilding;
    this.material = new THREE.MeshBasicMaterial({ color: 0xf59440 });
  }

  rebuildTower = () => {
    this.upgradeTower();
    this.upgradeBuilding();
  };

  activate = () => {
    this.active = true;
    this.rebuildTower();
  };

  upgradeTower = () => {
    const height = settings.TOWER_DEFAULT_SIZE;

    this.geometry = new THREE.BoxGeometry(
      settings.TOWER_DEFAULT_SIZE,
      settings.TOWER_DEFAULT_SIZE,
      height
    );
    this.position.set(
      this.building.position.x,
      this.building.position.y,
      this.building.position.z + height / 2
    );
  };

  inRange = (objectPosition3d: THREE.Vector3) => {
    const towerPosition = new THREE.Vector3(
      this.building.position.x,
      this.building.position.y,
      0
    );
    const objectPosition2d = new THREE.Vector3(
      objectPosition3d.x,
      objectPosition3d.y,
      0
    );
    const distanceBetween = towerPosition.distanceTo(objectPosition2d);
    const distanceRange =
      this.range.value * settings.FIELD_SIZE + settings.FIELD_SIZE / 2;
    return distanceBetween <= distanceRange;
  };
}
