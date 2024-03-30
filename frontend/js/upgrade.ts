import { Mailbox } from "./mailbox";
import { Message } from "./message";
import { settings } from "./settings";

export class Upgrade {
  name: string;
  level: number;
  maxLevel: number;
  value: number;
  nextUpgradeCost: number;
  nextUpgradeIncrease: number;
  levelUpCallback: () => void;

  constructor(
    name: string,
    maxLevel: number,
    value: number,
    nextUpgradeCost: number,
    nextUpgradeIncrease: number,
    levelUpCallback: () => void
  ) {
    this.name = name;
    this.level = 0;
    this.maxLevel = maxLevel;
    this.value = value;
    this.nextUpgradeCost = nextUpgradeCost;
    this.nextUpgradeIncrease = nextUpgradeIncrease;
    this.levelUpCallback = levelUpCallback;
  }

  canLevelUp = () => {
    return this.level < this.maxLevel;
  };

  levelUp = () => {
    if (!this.canLevelUp()) {
      return;
    }
    this.level++;
    this.value += this.nextUpgradeIncrease;
    const message = new Message(
      `${this.name} upgrade done successfully. -${this.nextUpgradeIncrease}`,
      "informative",
      settings.MESSAGE_TTL
    );
    Mailbox.getInstance().addMessage(message);
    this.levelUpCallback();
  };
}
