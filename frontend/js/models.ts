import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { settings } from "./settings";

export class Models {
  private static instance: Models;
  private enemyModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private enemyClips: THREE.AnimationClip[];

  private constructor() {
    this.enemyClips = [];

    const geometry = new THREE.SphereGeometry(settings.ENEMY_SIZE);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    this.enemyModel = new THREE.Mesh(geometry, material);

    const loader = new GLTFLoader();

    loader.load(
      "../assets/models/cow.gltf",
      (gltf) => {
        this.enemyModel = gltf.scene;
        this.enemyModel.scale.setScalar(12);
        this.enemyModel.rotation.set(Math.PI / 2, Math.PI / 2, 0);
        this.enemyClips = gltf.animations;
      },
      undefined,
      (error) => {
        console.error("Error during enemy model loading.");
      }
    );
  }

  static getInstance = () => {
    if (!Models.instance) {
      Models.instance = new Models();
    }

    return Models.instance;
  };

  getEnemyModelClone = () => {
    return SkeletonUtils.clone(this.enemyModel);
  };

  getEnemyClips = () => {
    return this.enemyClips;
  };
}
