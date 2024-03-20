import * as THREE from "three";
import { Field } from "./field";
import { Coord, Surface } from "../types";

export class Path extends Field {
  constructor(coord: Coord, type: Surface) {
    super(coord, type);
  }

  colorField = (selected: boolean) => {
    this.material = new THREE.MeshBasicMaterial({
      color: selected ? 0xff00ff : 0xedea3e,
    });
  };
}
