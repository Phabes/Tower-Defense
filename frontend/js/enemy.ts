import * as THREE from "three";
import { Field } from "./fields/field";
import { settings } from "./settings";
import { Message } from "./message";
import { Mailbox } from "./mailbox";
import { Models } from "./models";
import { Animation } from "./animation";

export class Enemy extends THREE.Group {
  hp: number;
  speed: number;
  money: number;
  currentField: Field;
  nextField: Field | null;
  enemyFinishedPath: (e: Enemy) => void;
  alive: boolean;
  active: boolean;
  animation: Animation;
  enemyModel: THREE.Object3D<THREE.Object3DEventMap>;

  constructor(
    hp: number,
    speed: number,
    money: number,
    currentField: Field,
    enemyFinishedPath: (e: Enemy) => void
  ) {
    super();
    this.hp = hp;
    this.speed = speed;
    this.money = money;
    this.currentField = currentField;
    this.nextField = currentField.getRandomNextField();
    this.enemyFinishedPath = enemyFinishedPath;
    this.alive = false;
    this.active = true;
  }

  setAlive = (alive: boolean) => {
    this.alive = alive;
  };

  setActive = (active: boolean) => {
    this.active = active;
  };

  spawn = () => {
    this.position.set(
      this.currentField.position.x,
      this.currentField.position.y,
      this.currentField.position.z
    );

    const models = Models.getInstance();
    this.enemyModel = models.getEnemyModelClone();
    const enemyClips = models.getEnemyClips();
    this.animation = new Animation(this.enemyModel, enemyClips);
    this.animation.setAnimation("Walk");

    this.add(this.enemyModel);

    return this;
  };

  move = () => {
    if (!this.nextField) {
      return;
    }

    this.animation.animate();

    const currentFieldPosition = this.currentField.position;
    const nextFieldPosition = this.nextField.position;
    const moveVector = nextFieldPosition
      .clone()
      .sub(currentFieldPosition)
      .normalize();
    this.translateOnAxis(moveVector, this.speed);

    const angle = Math.atan2(
      nextFieldPosition.x - currentFieldPosition.x,
      currentFieldPosition.y - nextFieldPosition.y
    );
    this.enemyModel.rotation.y = angle;

    if (this.checkFieldChange()) {
      this.currentField = this.nextField;
      this.nextField = this.nextField.getRandomNextField();
      if (!this.nextField) {
        this.enemyFinishedPath(this);
      }
    }
  };

  checkFieldChange = () => {
    if (!this.nextField) {
      return false;
    }
    const distanceToEnemy = this.currentField.position.distanceTo(
      this.position
    );
    const distanceToNextField = this.currentField.position.distanceTo(
      this.nextField.position
    );
    return distanceToEnemy >= distanceToNextField;
  };

  takeDamage = (damage: number) => {
    this.hp -= damage;
    return this.hp > 0;
  };

  died = () => {
    const message = new Message(
      `Enemy killed. +${this.money} gold`,
      "success",
      settings.MESSAGE_TTL
    );
    Mailbox.getInstance().addMessage(message);
  };

  success = () => {
    const message = new Message(
      "Enemy finished path.",
      "error",
      settings.MESSAGE_TTL
    );
    Mailbox.getInstance().addMessage(message);
  };
}
