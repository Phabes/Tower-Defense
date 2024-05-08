import * as THREE from "three";
import { Field } from "./field";
import { Coord, Surface } from "../types";
import { settings } from "../settings";
import { Models } from "../models";
import { Loading } from "../loading";

export class Path extends Field {
  constructor(coord: Coord, type: Surface) {
    super(coord, type);
  }

  colorField = (selected: boolean) => {
    const models = Models.getInstance();
    const modelsLoaded = models.getModelsLoadedStatus();
    const color = selected ? 0xff00ff : 0xedea3e;

    this.material = new THREE.MeshBasicMaterial({
      map: modelsLoaded ? models.getPathTexture() : undefined,
      color: !modelsLoaded ? color : undefined,
    });
  };

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
