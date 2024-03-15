import * as THREE from "three";
import $ from "jquery";
import { Game } from "./game";
import { Camera } from "./camera";
import { Renderer } from "./renderer";

$(document).ready(function () {
  const scene = new THREE.Scene();
  const camera = new Camera(scene);
  const renderer = new Renderer(scene, camera);

  new Game(scene, camera, renderer);
});
