import * as THREE from "three";

export class Animation {
  private clock: THREE.Clock;
  private mixer: THREE.AnimationMixer;
  private clips: THREE.AnimationClip[];
  private action: THREE.AnimationAction;

  constructor(
    model: THREE.Object3D<THREE.Object3DEventMap>,
    clips: THREE.AnimationClip[]
  ) {
    this.clock = new THREE.Clock();
    this.mixer = new THREE.AnimationMixer(model);
    this.clips = clips;
  }

  setAnimation = (name: string) => {
    if (this.action) {
      this.action.stop();
    }
    const clip = THREE.AnimationClip.findByName(this.clips, name);
    this.action = this.mixer.clipAction(clip);
    if (this.action) {
      this.action.play();
    }
  };

  animate = () => {
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }
  };
}
