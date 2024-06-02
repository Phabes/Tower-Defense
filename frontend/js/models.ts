import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { settings } from "./settings";
import { Loading } from "./loading";

export class Models {
  private static instance: Models;
  private modelsLoaded: boolean;
  private enemyModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private towerModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private treeModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private houseModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private barnModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private castleModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private bulletModel: THREE.Group<THREE.Object3DEventMap> | THREE.Mesh;
  private grassTexture: THREE.Texture | undefined;
  private pathTexture: THREE.Texture | undefined;

  private constructor() {
    this.modelsLoaded = false;

    const towerGeometry = new THREE.BoxGeometry(
      settings.TOWER_DEFAULT_SIZE,
      settings.TOWER_DEFAULT_SIZE,
      settings.TOWER_DEFAULT_SIZE
    );
    const towerMaterial = new THREE.MeshBasicMaterial({ color: 0x96174a });
    this.towerModel = new THREE.Mesh(towerGeometry, towerMaterial);

    const enemyGeometry = new THREE.SphereGeometry(settings.ENEMY_SIZE);
    const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    this.enemyModel = new THREE.Mesh(enemyGeometry, enemyMaterial);

    const treeGeometry = new THREE.SphereGeometry(settings.TREE_SIZE);
    const treeMaterial = new THREE.MeshBasicMaterial({ color: 0x17964b });
    this.treeModel = new THREE.Mesh(treeGeometry, treeMaterial);

    const houseGeometry = new THREE.BoxGeometry(
      settings.HOUSE_DEFAULT_SIZE,
      settings.HOUSE_DEFAULT_SIZE,
      settings.HOUSE_DEFAULT_SIZE
    );
    const houseMaterial = new THREE.MeshBasicMaterial({ color: 0xf59440 });
    this.houseModel = new THREE.Mesh(houseGeometry, houseMaterial);

    const barnGeometry = new THREE.BoxGeometry(
      settings.BARN_DEFAULT_SIZE,
      settings.BARN_DEFAULT_SIZE,
      settings.BARN_DEFAULT_SIZE
    );
    const barnMaterial = new THREE.MeshBasicMaterial({ color: 0xf59440 });
    this.barnModel = new THREE.Mesh(barnGeometry, barnMaterial);

    const castleGeometry = new THREE.BoxGeometry(
      settings.CASTLE_DEFAULT_SIZE,
      settings.CASTLE_DEFAULT_SIZE,
      settings.CASTLE_DEFAULT_SIZE
    );
    const castleMaterial = new THREE.MeshBasicMaterial({ color: 0xf59440 });
    this.castleModel = new THREE.Mesh(castleGeometry, castleMaterial);

    const bulletGeometry = new THREE.SphereGeometry(settings.BULLET_SIZE);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x34deeb });
    this.bulletModel = new THREE.Mesh(bulletGeometry, bulletMaterial);

    this.loadModels()
      .then((models) => {
        [
          this.towerModel,
          this.enemyModel,
          this.treeModel,
          this.houseModel,
          this.barnModel,
          this.castleModel,
          this.bulletModel,
          this.grassTexture,
          this.pathTexture,
        ] = models;

        this.enemyModel.scale.setScalar(settings.ENEMY_SCALE);
        this.enemyModel.rotation.set(Math.PI / 2, Math.PI / 2, 0);

        this.towerModel.scale.setScalar(settings.TOWER_SCALE);
        this.towerModel.rotation.set(Math.PI / 2, 0, 0);

        this.houseModel.rotation.set(Math.PI / 2, 0, 0);

        this.barnModel.rotation.set(Math.PI / 2, 0, 0);

        this.castleModel.rotation.set(Math.PI / 2, -1*Math.PI/2, 0);

        this.treeModel.rotation.set(Math.PI / 2, 0, 0);

        this.bulletModel.scale.setScalar(settings.BULLET_SCALE);
        this.bulletModel.rotation.set(Math.PI / 2, 0, 0);

        this.modelsLoaded = true;
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
      gltfLoader.loadAsync("../assets/models/House/scene.gltf").then((res) => {
        return res.scene;
      }),
      gltfLoader.loadAsync("../assets/models/Barn/scene.gltf").then((res) => {
        return res.scene;
      }),
      gltfLoader.loadAsync("../assets/models/FinalHouse/scene.gltf").then((res) => {
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

  getModelsLoadedStatus = () => {
    return this.modelsLoaded;
  };

  getTowerModelClone = () => {
    const container = new THREE.Object3D();
    container.add(SkeletonUtils.clone(this.towerModel));
    return container;
  };

  getEnemyModelClone = () => {
    const container = new THREE.Object3D();
    container.add(SkeletonUtils.clone(this.enemyModel));
    return container;
  };

  getEnemyClips = () => {
    return this.enemyModel.animations;
  };

  getTreeModelClone = () => {
    const container = new THREE.Object3D();
    const treeCopy = SkeletonUtils.clone(this.treeModel);

    if (this.modelsLoaded) {
      const scalar =
        Math.floor(
          Math.random() * (settings.TREE_MAX_SCALE - settings.TREE_MIN_SCALE)
        ) + settings.TREE_MIN_SCALE;
      treeCopy.scale.setScalar(scalar);
    }

    const rotation = Math.random();
    container.rotateZ(Math.PI * rotation);

    container.add(treeCopy);
    return container;
  };

  getHouseModelClone = () => {
    const container = new THREE.Object3D();
    const houseCopy = SkeletonUtils.clone(this.houseModel);

    if (this.modelsLoaded) {
      const scalar =
        Math.floor(
          Math.random() * (settings.HOUSE_MAX_SCALE - settings.HOUSE_MIN_SCALE)
        ) + settings.HOUSE_MIN_SCALE;
      houseCopy.scale.setScalar(scalar);
    }

    container.add(houseCopy);
    return container;
  };
  
  getBarnModelClone = () => {
    const container = new THREE.Object3D();
    const barnCopy = SkeletonUtils.clone(this.barnModel);

    if (this.modelsLoaded) {
      const scalar =
        Math.floor(
          Math.random() * (settings.BARN_MAX_SCALE - settings.BARN_MIN_SCALE)
        ) + settings.BARN_MIN_SCALE;
      barnCopy.scale.setScalar(scalar);
    }

    container.add(barnCopy);
    return container;
  };

  getCastleModelClone = () => {
    const container = new THREE.Object3D();
    const castleCopy = SkeletonUtils.clone(this.castleModel);

    if (this.modelsLoaded) {
      const scalar =
        Math.floor(
          Math.random() * (settings.CASTLE_MAX_SCALE - settings.CASTLE_MIN_SCALE)
        ) + settings.CASTLE_MIN_SCALE;
      castleCopy.scale.setScalar(scalar);
    }

    container.add(castleCopy);
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
