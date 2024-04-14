import * as THREE from "three";
import { Field } from "./field";
import { Coord, Surface } from "../types";

export class Path extends Field {
  typeColors = {
    "default":"#edea3e",
    "start":"#f5ad42",
    "end":"#4242f5"
  }
  constructor(coord: Coord, type: Surface) {
    super(coord, type);
    this.color = this.isSelected ? "#ff00ff" : "#edea3e";
  }

  colorField = () => {
    this.material = new THREE.MeshBasicMaterial({
      color: this.color,
    });
  };
  changeColor = (type: "default" | "start" | "end") => {
    this.color = this.typeColors[type];
    (this.material as THREE.MeshBasicMaterial).color.set(this.color);
  }
}
