import * as THREE from "three";
import $ from "jquery";
import { Game } from "./game";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Models } from "./models";
import { Light } from "./light";
import { Controls } from "./controls";
import { Loading } from "./loading";

$(document).ready(function () {
  Loading.getInstance().setLoadingStatus();
  Models.getInstance();

  const renderer = new Renderer();
  const camera = new Camera();
  const light = new Light();
  const controls = new Controls(camera, renderer.domElement);
  const scene = new THREE.Scene();

  scene.add(camera);
  scene.add(light);

  new Game(scene, camera, renderer, controls);
});
