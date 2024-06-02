import * as THREE from "three";
import { Field } from "./field";
import { Coord, Surface } from "../types";
import { settings } from "../settings";
import { Models } from "../models";
import { Loading } from "../loading";
import { bool } from "three/examples/jsm/nodes/shadernode/ShaderNode";

export class Path extends Field {
  typeColors = {
    "default":"#edea3e",
    "start":"#f5ad42",
    "end":"#4242f5",
    "highlight":"#42daf5"
  }
  isStartField:boolean = false;
  isEndField:boolean = false;
  constructor(coord: Coord, type: Surface, isStartField:boolean, isEndField:boolean) {
    super(coord, type);
    this.color = this.isSelected ? "#ff00ff" : "#edea3e";
    this.isStartField = isStartField;
    this.isEndField = isEndField;
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
    this.elementsOnField.clear()
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
    console.log(this.isStartField)
    if (this.isStartField) {
      this.turnToStartingField(mapSizeY)
    }
    if(this.isEndField){
      this.turnToEndingField(mapSizeY)
    }
    this.elementsOnField.add(this);
    return this.elementsOnField;
  };

  turnToStartingField = (mapSizeY: number) => {
    this.isStartField = true;
    const barn = Models.getInstance().getBarnModelClone();
    barn.position.set(
      this.coord.x * (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
      settings.FIELD_SIZE / 2,
      (mapSizeY - this.coord.y - 1) *
      (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
      settings.FIELD_SIZE / 2,
      3
    );
    this.elementsOnField.add(barn);
  }

  turnToEndingField = (mapSizeY: number) => {
    this.isEndField = true;
    const castle = Models.getInstance().getCastleModelClone();
    castle.position.set(
      this.coord.x * (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
      settings.FIELD_SIZE / 1.3,
      (mapSizeY - this.coord.y - 1) *
      (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
      settings.FIELD_SIZE / 2,
      3
    );
    this.elementsOnField.add(castle);
  }
}
