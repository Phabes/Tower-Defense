import { settings } from "./settings";

export class Player {
  constructor(hp, money) {
    this.hp = hp;
    this.money = money;
    this.level = this.getPlayerLevel();
  }

  takeDamage = (damage) => {
    this.hp -= damage;
  };

  addMoney = (money) => {
    this.money += money;
  };

  substractMoney = (money) => {
    this.money -= money;
  };

  changePlayerLevel = (level) => {
    if (level > this.level) {
      this.level = level;
      this.setCookie(settings.COOKIE, level, 1);
    }
  };

  getPlayerLevel = () => {
    const playerLevel = this.getCookie(settings.COOKIE);
    if (playerLevel == "") {
      this.setCookie(settings.COOKIE, 0, 1);
    } else {
      this.setCookie(settings.COOKIE, playerLevel, 1);
    }
    return this.getCookie(settings.COOKIE);
  };

  setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };

  getCookie = (cname) => {
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
