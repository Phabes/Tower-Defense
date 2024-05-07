import * as THREE from "three";
import { Field } from "./field";
import { Coord, Surface } from "../types";
import { Tower } from "../tower";
import { showTowerPanel } from "../ui";
import { Player } from "../player";
import { settings } from "../settings";
import { Models } from "../models";

export class Building extends Field {
  tower: Tower;

  constructor(coord: Coord, type: Surface) {
    super(coord, type);
    this.tower = new Tower(this, this.upgradeBuilding);
  }

  colorField = (selected: boolean) => {
    this.material = new THREE.MeshBasicMaterial({
      color: selected ? 0x93d4ed : 0xeb7063,
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
    this.colorField(false);
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
