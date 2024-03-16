import * as THREE from "three";
import { settings } from "./settings";
import { Coord, Surface } from "./types";

export class Field extends THREE.Mesh {
  coord: Coord;
  type: Surface;
  nextFields: Field[];
  position: THREE.Vector3;
  mesh: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >;
  constructor(coord: Coord, type: Surface) {
    super();
    this.coord = coord;
    this.type = type;
    this.nextFields = [];
  }

  setNextFields = (nextFields: Field[]) => {
    this.nextFields = nextFields;
  };

  getRandomNextField = () => {
    if (this.nextFields.length == 0) {
      return null;
    }
    return this.nextFields[Math.floor(Math.random() * this.nextFields.length)];
  };

  createField = (mapSizeY: number) => {
    this.geometry = new THREE.PlaneGeometry(
      settings.FIELD_SIZE,
      settings.FIELD_SIZE
    );
    this.material = new THREE.MeshBasicMaterial({
      color:
        this.type == "grass"
          ? 0x00ff00
          : this.type == "path"
          ? 0xffff00
          : 0xff0000,
    });
    this.position.set(
      this.coord.x * (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
        settings.FIELD_SIZE / 2,
      (mapSizeY - this.coord.y - 1) *
        (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
        settings.FIELD_SIZE / 2,
      0
    );
    return this;
  };
}
