import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { settings } from "./settings";

export class Models {
  private static instance: Models;
  private enemyModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private enemyClips: THREE.AnimationClip[];
  private towerModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;

  private constructor() {
    this.enemyClips = [];

    const enemyGeometry = new THREE.SphereGeometry(settings.ENEMY_SIZE);
    const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    this.enemyModel = new THREE.Mesh(enemyGeometry, enemyMaterial);

    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      "../assets/models/Enemy/cow.gltf",
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

    const towerGeometry = new THREE.BoxGeometry(
      settings.TOWER_DEFAULT_SIZE,
      settings.TOWER_DEFAULT_SIZE,
      settings.TOWER_DEFAULT_SIZE
    );
    const towerMaterial = new THREE.MeshBasicMaterial({ color: 0xf59440 });
    this.towerModel = new THREE.Mesh(towerGeometry, towerMaterial);

    const objLoader = new OBJLoader();

    objLoader.load(
      "../assets/models/Tower/Magic_tower.obj",
      (obj) => {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
          "../assets/models/Tower/Magic_Tower_LP_BaseColor_v1.png",
          (texture) => {
            this.towerModel = obj;
            this.towerModel.scale.setScalar(12);
            this.towerModel.rotation.set(Math.PI / 2, 0, 0);
            obj.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                child.material.map = texture;
                child.geometry.computeVertexNormals();
              }
            });
          }
        );
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
    const container = new THREE.Object3D();
    container.add(SkeletonUtils.clone(this.enemyModel));
    return container;
  };

  getEnemyClips = () => {
    return this.enemyClips;
  };

  getTowerModelClone = () => {
    const container = new THREE.Object3D();
    container.add(SkeletonUtils.clone(this.towerModel));
    return container;
  };
}
