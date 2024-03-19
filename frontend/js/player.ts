import { settings } from "./settings";

export class Player {
  hp: number;
  maxHP: number;
  money: number;
  level: number;

  constructor(hp: number, money: number) {
    this.hp = hp;
    this.maxHP = hp;
    this.money = money;
    this.level = this.getPlayerLevel();
  }

  levelCompleted = () => {
    this.hp = this.maxHP;
  };

  takeDamage = (damage: number) => {
    this.hp -= damage;
  };

  addMoney = (money: number) => {
    this.money += money;
  };

  substractMoney = (money: number) => {
    this.money -= money;
  };

  canBuy = (money: number) => {
    return this.money >= money;
  };

  changePlayerLevel = (level: number) => {
    if (level > this.level) {
      this.level = level;
      this.setCookie(settings.COOKIE, level.toString(), 1);
    }
  };

  getPlayerLevel = () => {
    const playerLevel = this.getCookie(settings.COOKIE);
    if (playerLevel == "") {
      this.setCookie(settings.COOKIE, "0", 1);
    } else {
      this.setCookie(settings.COOKIE, playerLevel, 1);
    }
    return parseInt(this.getCookie(settings.COOKIE));
  };

  setCookie = (cname: string, cvalue: string, exdays: number) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };

  getCookie = (cname: string) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };
}
