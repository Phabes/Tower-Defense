import * as THREE from "three";
import $ from "jquery";
import { Game } from "./game";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Models } from "./models";
import { Light } from "./light";

$(document).ready(function () {
  const scene = new THREE.Scene();
  const camera = new Camera(scene);
  const renderer = new Renderer(scene, camera);
  const light = new Light();

  scene.add(light);

  Models.getInstance();

  new Game(scene, camera, renderer);
});
