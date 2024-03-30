import * as THREE from "three";

export class Light extends THREE.DirectionalLight {
  constructor() {
    super(0xffffff, 1);
    this.position.set(0, 0, 2000);
  }
}
