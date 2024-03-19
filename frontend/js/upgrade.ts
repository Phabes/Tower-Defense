export class Upgrade {
  level: number;
  maxLevel: number;
  value: number;
  nextUpgradeCost: number;
  nextUpgradeIncrease: number;
  levelUpCallback: () => void;

  constructor(
    maxLevel: number,
    value: number,
    nextUpgradeCost: number,
    nextUpgradeIncrease: number,
    levelUpCallback: () => void
  ) {
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
    this.levelUpCallback();
  };
}
