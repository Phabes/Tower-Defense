export class Camera {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
  }

  setCamera = () => {
    this.camera.position.set(0, -600, 1000);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);
  };
}
