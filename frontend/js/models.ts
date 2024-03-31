import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { settings } from "./settings";

export class Models {
  private static instance: Models;
  private enemyModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private towerModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private texture: THREE.Texture | undefined;

  private constructor() {
    const enemyGeometry = new THREE.SphereGeometry(settings.ENEMY_SIZE);
    const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    this.enemyModel = new THREE.Mesh(enemyGeometry, enemyMaterial);

    const towerGeometry = new THREE.BoxGeometry(
      settings.TOWER_DEFAULT_SIZE,
      settings.TOWER_DEFAULT_SIZE,
      settings.TOWER_DEFAULT_SIZE
    );
    const towerMaterial = new THREE.MeshBasicMaterial({ color: 0xf59440 });
    this.towerModel = new THREE.Mesh(towerGeometry, towerMaterial);

    this.loadModels()
      .then((models) => {
        [this.towerModel, this.texture, this.enemyModel] = models;

        this.enemyModel.scale.setScalar(12);
        this.enemyModel.rotation.set(Math.PI / 2, Math.PI / 2, 0);

        this.towerModel.scale.setScalar(12);
        this.towerModel.rotation.set(Math.PI / 2, 0, 0);
        this.towerModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.map = this.texture;
            child.geometry.computeVertexNormals();
          }
        });
      })
      .catch(() => {
        console.log("Error during models loading.");
      });
  }

  private loadModels = async () => {
    const gltfLoader = new GLTFLoader();
    const objLoader = new OBJLoader();
    const textureLoader = new THREE.TextureLoader();

    return await Promise.all([
      objLoader.loadAsync("../assets/models/Tower/Magic_tower.obj"),
      textureLoader.loadAsync(
        "../assets/models/Tower/Magic_Tower_LP_BaseColor_v1.png"
      ),
      gltfLoader.loadAsync("../assets/models/Enemy/cow.gltf").then((res) => {
        for (const animation of res.animations) {
          res.scene.animations.push(animation);
        }
        return res.scene;
      }),
    ]);
  };

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
    return this.enemyModel.animations;
  };

  getTowerModelClone = () => {
    const container = new THREE.Object3D();
    container.add(SkeletonUtils.clone(this.towerModel));
    return container;
  };
}
