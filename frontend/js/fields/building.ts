import * as THREE from "three";
import { Field } from "./field";
import { Coord, Surface } from "../types";
import { Tower } from "../tower";
import { showTowerPanel } from "../ui";
import { Player } from "../player";
import { settings } from "../settings";

export class Building extends Field {
  tower: Tower;

  constructor(coord: Coord, type: Surface) {
    super(coord, type);
    this.tower = new Tower(this, this.upgradeBuilding);
  }

  colorField = () => {
    this.material = new THREE.MeshBasicMaterial({
      color: this.isSelected ? 0xff00ff : 0xeb4634,
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

  createField = (mapSizeY: number) => {
    this.geometry = new THREE.PlaneGeometry(
      settings.FIELD_SIZE,
      settings.FIELD_SIZE
    );
    this.colorField();
    this.position.set(
      this.coord.x * (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
        settings.FIELD_SIZE / 2,
      (mapSizeY - this.coord.y - 1) *
        (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
        settings.FIELD_SIZE / 2,
      0
    );
    this.elementsOnField.add(this);
    return this.elementsOnField;
  };
}
