import * as THREE from "three";
import { Field } from "./field";
import { Coord, Surface } from "../types";
import { Tower } from "../tower";
import { showTowerPanel } from "../ui";
import { Player } from "../player";

export class Building extends Field {
  tower: Tower;

  constructor(coord: Coord, type: Surface) {
    super(coord, type);
    this.tower = new Tower(this, this.upgradeBuilding);
  }

  colorField = (selected: boolean) => {
    this.material = new THREE.MeshBasicMaterial({
      color: selected ? 0xff00ff : 0xeb4634,
    });
  };

  showPanel = (show: boolean, player: Player) => {
    showTowerPanel(show ? this.tower : null, player);
  };

  upgradeBuilding = () => {
    this.addFieldElement(this.tower);
  };

  fieldHover = () => {
    if (this.tower.active) {
      this.tower.hovered(true);
    }
  };

  fieldLeave = () => {};
}
