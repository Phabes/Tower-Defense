export class Player {
  constructor(hp, money) {
    this.hp = hp;
    this.money = money;
  }

  damageTaken = (damage) => {
    this.hp -= damage;
  };

  addMoney = (money) => {
    this.money += money;
  };

  substractMoney = (money) => {
    this.money -= money;
  };
}
