import * as THREE from "three";
import { settings } from "./settings";
import { Building } from "./fields/building";
import { Upgrade } from "./upgrade";

export class Tower extends THREE.Mesh {
  building: Building;
  active: boolean;
  range: Upgrade;
  power: Upgrade;
  speed: Upgrade;
  upgradeBuilding: () => void;

  constructor(building: Building, upgradeBuilding: () => void) {
    super();
    this.building = building;
    this.active = false;
    this.range = new Upgrade(2, 0, 300, 1, this.rebuildTower);
    this.power = new Upgrade(2, 0, 250, 50, this.rebuildTower);
    this.speed = new Upgrade(2, 0, 200, 20, this.rebuildTower);
    this.upgradeBuilding = upgradeBuilding;
    this.material = new THREE.MeshBasicMaterial({ color: 0xf59440 });
  }

  rebuildTower = () => {
    this.active = true;
    this.upgradeTower();
    this.upgradeBuilding();
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
}
