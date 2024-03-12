import * as THREE from "three";
import { settings } from "./settings";

export class Field {
  constructor(y, x, type, mapSizeY) {
    this.y = y;
    this.x = x;
    this.type = type;
    this.nextFields = [];
    this.position = new THREE.Vector3(
      x * (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
        settings.FIELD_SIZE / 2,
      (mapSizeY - y - 1) * (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
        settings.FIELD_SIZE / 2,
      0
    );
  }

  setNextFields = (nextFields) => {
    this.nextFields = nextFields;
  };

  getRandomNextField = () => {
    if (this.nextFields.length == 0) {
      return null;
    }
    return this.nextFields[Math.floor(Math.random() * this.nextFields.length)];
  };

  createField = () => {
    const geometry = new THREE.PlaneGeometry(
      settings.FIELD_SIZE,
      settings.FIELD_SIZE
    );
    const material = new THREE.MeshBasicMaterial({
      color:
        this.type == "grass"
          ? 0x00ff00
          : this.type == "path"
          ? 0xffff00
          : 0xff0000,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    return this.mesh;
  };
}
