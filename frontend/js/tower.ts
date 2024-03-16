import * as THREE from "three";
import { settings } from "./settings";
import { Building } from "./fields/building";

export class Tower extends THREE.Mesh {
  building: Building;
  range: number;
  power: number;
  speed: number;
  upgradeBuilding: () => void;

  constructor(building: Building, upgradeBuilding: () => void) {
    super();
    this.building = building;
    this.range = 0;
    this.power = 0;
    this.speed = 0;
    this.upgradeBuilding = upgradeBuilding;
    this.material = new THREE.MeshBasicMaterial({ color: 0xf59440 });
  }

  upgradeRange = () => {
    this.range++;
    this.rebuildTower();
  };

  upgradePower = () => {
    this.power++;
    this.rebuildTower();
  };

  upgradeSpeed = () => {
    this.speed++;
    this.rebuildTower();
  };

  rebuildTower = () => {
    this.upgradeTower();
    this.upgradeBuilding();
  };

  upgradeTower = () => {
    this.range += 10; // to delete
    const height =
      settings.TOWER_DEFAULT_SIZE + this.range + this.power + this.speed;

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
}
