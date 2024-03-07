import * as THREE from "three";
import $ from "jquery";
import { Game } from "./game";

$(document).ready(function () {
  const boardElement = $("#board");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    boardElement.width() / boardElement.height()
  );
  const renderer = new THREE.WebGLRenderer();

  new Game(scene, camera, renderer);
});
