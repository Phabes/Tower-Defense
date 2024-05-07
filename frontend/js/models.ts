import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { settings } from "./settings";
import { removeLoading, setErrorMessage, setLoadingMessage } from "./ui";
import { Loading } from "./loading";

export class Models {
  private static instance: Models;
  private enemyModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private towerModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private treeModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private bulletModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private grassTexture: THREE.Texture | undefined;
  private pathTexture: THREE.Texture | undefined;

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

    const bushGeometry = new THREE.SphereGeometry(settings.ENEMY_SIZE / 2);
    const bushMaterial = new THREE.MeshBasicMaterial({ color: 0x26d46e });
    this.treeModel = new THREE.Mesh(bushGeometry, bushMaterial);

    const bulletGeometry = new THREE.SphereGeometry(settings.BULLET_SIZE);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x34deeb });
    this.bulletModel = new THREE.Mesh(bulletGeometry, bulletMaterial);

    this.loadModels()
      .then((models) => {
        [
          this.towerModel,
          this.enemyModel,
          this.treeModel,
          this.bulletModel,
          this.grassTexture,
          this.pathTexture,
        ] = models;

        this.enemyModel.scale.setScalar(12);
        this.enemyModel.rotation.set(Math.PI / 2, Math.PI / 2, 0);

        this.towerModel.scale.setScalar(12);
        this.towerModel.rotation.set(Math.PI / 2, 0, 0);

        this.treeModel.rotation.set(Math.PI / 2, 0, 0);

        this.bulletModel.scale.setScalar(2);
        this.bulletModel.rotation.set(Math.PI / 2, 0, 0);

        Loading.getInstance().setModelsLoaded(true);
      })
      .catch(() => {
        Loading.getInstance().setModelsError(true);
      });
  }

  static getInstance = () => {
    if (!Models.instance) {
      Models.instance = new Models();
    }

    return Models.instance;
  };

  private loadModels = async () => {
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    return await Promise.all([
      gltfLoader.loadAsync("../assets/models/Tower/scene.gltf").then((res) => {
        return res.scene;
      }),
      gltfLoader.loadAsync("../assets/models/Enemy/cow.gltf").then((res) => {
        for (const animation of res.animations) {
          res.scene.animations.push(animation);
        }
        return res.scene;
      }),
      gltfLoader.loadAsync("../assets/models/Tree/scene.gltf").then((res) => {
        return res.scene;
      }),
      gltfLoader
        .loadAsync("../assets/models/Fireball/scene.gltf")
        .then((res) => {
          return res.scene;
        }),
      textureLoader.loadAsync("../assets/images/grass.jpg"),
      textureLoader.loadAsync("../assets/images/path.jpg"),
    ]);
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

  getTreeModelClone = () => {
    const container = new THREE.Object3D();
    const scalar = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
    const bushCopy = SkeletonUtils.clone(this.treeModel);
    bushCopy.scale.setScalar(scalar);
    container.add(bushCopy);
    return container;
  };

  getBulletClone = () => {
    return SkeletonUtils.clone(this.bulletModel);
  };

  getGrassTexture = () => {
    return this.grassTexture;
  };

  getPathTexture = () => {
    return this.pathTexture;
  };
}
